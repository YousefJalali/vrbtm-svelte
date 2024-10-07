import { fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import prisma from '$lib/prisma'
import { lucia } from '$lib/server/auth'
import { generateEmailVerificationCode } from '$lib/server/generateEmailVerificationCode'
import { sendVerificationCode } from '$lib/server/sendVerificationCode'

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user?.id) redirect(302, '/signup')

	const user = await prisma.user.findFirst({
		where: {
			id: event.locals.user?.id
		}
	})

	if (!user) redirect(302, '/signup')

	if (user.emailVerified) redirect(302, '/')

	const code = await prisma.verificationCode.findFirst({
		where: {
			userId: user.id
		}
	})

	if (!code) return { expireAt: undefined }

	return {
		expiresAt: code.expiresAt
	}
}

export const actions: Actions = {
	verify: async (event) => {
		const formData = await event.request.formData()

		if (!event.locals?.session?.id) {
			return fail(400, {
				message: 'no session'
			})
		}

		const { user } = await lucia.validateSession(event.locals.session.id)
		if (!user) {
			return fail(400, {
				message: 'no user'
			})
		}

		const code = formData.get('code')
		if (typeof code !== 'string') {
			return fail(400, {
				message: 'no code'
			})
		}

		const validCode = await verifyVerificationCode(user, code)
		if (!validCode) {
			return fail(400, {
				message: 'Wrong code'
			})
		}

		await lucia.invalidateUserSessions(user.id)
		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				emailVerified: true
			}
		})

		const session = await lucia.createSession(user.id, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		})
	},

	sendCode: async (event) => {
		if (!event.locals?.session?.id) {
			return fail(400, {
				message: 'no session'
			})
		}

		const { user } = await lucia.validateSession(event.locals.session.id)
		if (!user) {
			return fail(400, {
				message: 'no user'
			})
		}

		const existingCode = await prisma.verificationCode.findFirst({
			where: {
				userId: user.id
			}
		})

		if (existingCode && isWithinExpirationDate(existingCode.expiresAt)) {
			console.log('already there is a valid code')
			return fail(400, {
				message: 'Please wait for sometime to send another code.'
			})
		}

		try {
			const verificationCode = await generateEmailVerificationCode(user.id, user.email)
			await sendVerificationCode(user.email, verificationCode)

			return { success: true }
		} catch (error) {
			console.log('OTP', error)
		}
	}
}

async function verifyVerificationCode(
	user: { id: string; email: string },
	code: string
): Promise<boolean> {
	const dbCode = await prisma.verificationCode.findFirst({
		where: {
			userId: user.id
		}
	})

	if (!dbCode || dbCode.code !== code) {
		return false
	}
	await prisma.verificationCode.delete({
		where: {
			id: dbCode.id
		}
	})

	if (!isWithinExpirationDate(dbCode.expiresAt)) {
		return false
	}
	if (dbCode.email !== user.email) {
		return false
	}
	return true
}

function isWithinExpirationDate(date: Date) {
	const now = new Date()
	const d = date instanceof Date ? date : new Date(date)
	return d.getTime() > now.getTime()
}
