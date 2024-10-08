import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import prisma from '$lib/prisma'
import { lucia } from '$lib/server/auth'
import { Argon2id } from 'oslo/password'

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) redirect(302, '/')
	return {
		user: event.locals.user
	}
}

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData()
		const email = data.get('email')
		const password = data.get('password')

		type Keys = 'email' | 'password'
		const errors: {
			[K in Keys]?: {
				value: FormDataEntryValue | null
				error: string
			}
		} = {}

		if (typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
			errors.email = {
				value: '',
				error: 'Invalid email'
			}
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			errors.password = {
				value: '',
				error: 'Invalid password'
			}
		}

		if (Object.keys(errors).length || typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, {
				errors
			})
		}

		const existingUser = await prisma.user.findFirst({
			where: {
				email
			}
		})

		if (!existingUser) {
			return fail(400, {
				message: 'Incorrect username or password'
			})
		}

		const validPassword = await new Argon2id().verify(
			existingUser.hashedPassword as string,
			password
		)
		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect username or password'
			})
		}

		const session = await lucia.createSession(existingUser.id, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		})

		if (!existingUser.emailVerified) {
			redirect(302, '/email-verification')
		}

		redirect(302, '/')
	}
} satisfies Actions
