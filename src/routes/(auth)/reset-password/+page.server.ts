import prisma from '$lib/prisma'
import { createPasswordResetToken } from '$lib/server/createPasswordResetToken'
import { sendPasswordResetToken } from '$lib/server/sendPasswordResetToken'
import { fail, type Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData()
		const email = formData.get('email')

		if (typeof email !== 'string') {
			return fail(400, {
				message: 'Invalid Email'
			})
		}

		const existingUser = await prisma.user.findFirst({
			where: {
				email
			}
		})

		if (!existingUser) {
			return fail(400, {
				message: "Email Doesn't exist!"
			})
		}

		const verificationToken = await createPasswordResetToken(existingUser.id)
		const verificationLink = 'http://localhost:5173/reset-password/' + verificationToken

		await sendPasswordResetToken(email, verificationLink)

		return { success: true }
	}
}
