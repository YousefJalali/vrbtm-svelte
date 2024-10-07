import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { generateId } from 'lucia'
import prisma from '$lib/prisma'
import { lucia } from '$lib/server/auth'
import { generateEmailVerificationCode } from '$lib/server/generateEmailVerificationCode'
import { sendVerificationCode } from '$lib/server/sendVerificationCode'
import { Argon2id } from 'oslo/password'

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) redirect(302, '/')
	return {
		user: event.locals.user
	}
}

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData()
		const name = formData.get('name')
		const email = formData.get('email')
		const password = formData.get('password')

		type Keys = 'name' | 'email' | 'password'
		const errors: {
			[K in Keys]?: {
				value: FormDataEntryValue | null
				error: string
			}
		} = {}

		//name validation
		if (typeof name !== 'string' || name.length < 2) {
			errors.name = {
				value: name,
				error: 'Invalid Name'
			}
		}
		//email validation
		if (typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
			errors.email = {
				value: email,
				error: 'Invalid Email'
			}
		}
		//password validation
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			errors.password = {
				value: '',
				error: 'Invalid password'
			}
		}

		//return if validation failed
		if (
			Object.keys(errors).length ||
			typeof name !== 'string' ||
			typeof email !== 'string' ||
			typeof password !== 'string'
		) {
			return fail(400, {
				errors
			})
		}

		const userId = generateId(15)
		const hashedPassword = await new Argon2id().hash(password)

		try {
			await prisma.user.create({
				data: {
					id: userId,
					name,
					email,
					hashedPassword
				}
			})
		} catch (error) {
			console.log(error)
			return fail(400, {
				message: 'Failed to create user'
			})
		}

		try {
			const verificationCode = await generateEmailVerificationCode(userId, email)
			await sendVerificationCode(email, verificationCode)
		} catch (error) {
			console.log('OTP', error)
		}

		const session = await lucia.createSession(userId, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		})

		redirect(302, '/email-verification')
	}
}
