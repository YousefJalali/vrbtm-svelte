import { Lucia } from 'lucia'
import { dev } from '$app/environment'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import prisma from '$lib/prisma'
import { GitHub, Google } from 'arctic'
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '$env/static/private'

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      email: attributes.email,
      emailVerified: attributes.emailVerified,
    }
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: {
      email: string
      emailVerified: boolean
    }
  }
}

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)
export const google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:5173/login/google/callback'
)
