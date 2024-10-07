import { OAuth2RequestError } from 'arctic'
import { generateId } from 'lucia'
import { google, lucia } from '$lib/server/auth'

import { type RequestEvent } from '@sveltejs/kit'
import prisma from '$lib/prisma'

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code')
	const state = event.url.searchParams.get('state')
	const storedState = event.cookies.get('google_oauth_state') ?? null
	const storedCodeVerifier = event.cookies.get('google_code_verifier') ?? null

	if (!code || !state || !storedState || state !== storedState || !storedCodeVerifier) {
		return new Response(null, {
			status: 400
		})
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier)
		const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		})
		const googleUser = await googleUserResponse.json()

		//check if account exists
		const existingAccount = await prisma.oAuthAccount.findFirst({
			where: {
				providerId: 'google',
				providerUserId: '' + googleUser.sub
			}
		})

		if (existingAccount) {
			const session = await lucia.createSession(existingAccount.userId, {})
			const sessionCookie = lucia.createSessionCookie(session.id)
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			})

			return new Response(null, {
				status: 302,
				headers: {
					Location: '/'
				}
			})
		}

		//check if a user exist with the same email
		const existingUser = await prisma.user.findFirst({
			where: {
				email: googleUser.email
			}
		})

		let userId = generateId(15)
		if (existingUser) {
			userId = existingUser.id
		} else {
			//create new user
			await prisma.user.create({
				data: {
					id: userId,
					name: googleUser.name,
					email: googleUser.email,
					emailVerified: googleUser.emailVerified
				}
			})
		}

		//add new account to db
		await prisma.oAuthAccount.create({
			data: {
				providerId: 'google',
				providerUserId: '' + googleUser.sub,
				userId
			}
		})

		const session = await lucia.createSession(userId, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		})

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		})
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			console.log('oauth error', e)
			// invalid code
			return new Response(null, {
				status: 400
			})
		}
		console.log(e)
		return new Response(null, {
			status: 500
		})
	}
}

// interface GitHubUser {
//   sub: string
//   name: string
//   given_name: string
//   family_name: string
//   picture: string
//   email: string
//   emailVerified: boolean
//   locale: string
// }

// interface GitHubUserEmail {
//   email: string
//   primary: boolean
//   verified: boolean
//   visibility: null | string
// }
