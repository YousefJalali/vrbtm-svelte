import { OAuth2RequestError } from 'arctic'
import { generateId } from 'lucia'
import { github, lucia } from '$lib/server/auth'

import { type RequestEvent } from '@sveltejs/kit'
import prisma from '$lib/prisma'

export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get('code')
  const state = event.url.searchParams.get('state')
  const storedState = event.cookies.get('github_oauth_state') ?? null

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    })
  }

  try {
    const tokens = await github.validateAuthorizationCode(code)
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })
    const githubUser: GitHubUser = await githubUserResponse.json()

    //check if account exists
    const existingAccount = await prisma.oAuthAccount.findFirst({
      where: {
        providerId: 'github',
        providerUserId: '' + githubUser.id,
      },
    })

    if (existingAccount) {
      const session = await lucia.createSession(existingAccount.userId, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes,
      })

      return new Response(null, {
        status: 302,
        headers: {
          Location: '/',
        },
      })
    }

    //get email
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })
    const emails = await emailsResponse.json()

    if (!emails || !emails.length) {
      return new Response('No email', {
        status: 400,
      })
    }

    const primaryEmail =
      emails.find((email: GitHubUserEmail) => email.primary) ?? null

    if (!primaryEmail) {
      return new Response('No primary email address', {
        status: 400,
      })
    }

    //check if a user exist with the same email
    const existingUser = await prisma.user.findFirst({
      where: {
        email: primaryEmail.email,
      },
    })

    let userId = generateId(15)
    if (existingUser) {
      userId = existingUser.id
    } else {
      //create new user
      await prisma.user.create({
        data: {
          id: userId,
          name: githubUser.name,
          email: primaryEmail.email,
          emailVerified: primaryEmail.verified,
        },
      })
    }

    //add new account to db
    await prisma.oAuthAccount.create({
      data: {
        providerId: 'github',
        providerUserId: '' + githubUser.id,
        userId,
      },
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    })

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    })
  } catch (e) {
    console.log('oauth error', e)
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      })
    }
    return new Response(null, {
      status: 500,
    })
  }
}

interface GitHubUser {
  id: number
  login: string
  name: string
}

interface GitHubUserEmail {
  email: string
  primary: boolean
  verified: boolean
  visibility: null | string
}
