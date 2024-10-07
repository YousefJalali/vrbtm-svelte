import { fail, type Actions } from '@sveltejs/kit'
import { isWithinExpirationDate } from 'oslo'
import { Argon2id } from 'oslo/password'
import { sha256 } from 'oslo/crypto'
import { encodeHex } from 'oslo/encoding'
import prisma from '$lib/prisma'
import { lucia } from '$lib/server/auth'

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData()
		const password = formData.get('password')
		const confirmPassword = formData.get('confirmPassword')

		if (typeof password !== 'string' || password !== confirmPassword) {
			return fail(400, {
				message: 'Invalid Password'
			})
		}

		const verificationToken = event.params.token

		const tokenHash = encodeHex(await sha256(new TextEncoder().encode(verificationToken)))
		const token = await prisma.passwordResetToken.findFirst({
			where: {
				tokenHash
			}
		})

		if (token) {
			await prisma.passwordResetToken.delete({
				where: {
					tokenHash
				}
			})
		}

		if (!token || !isWithinExpirationDate(token.expiresAt)) {
			return fail(400, { message: 'Invalid token' })
		}

		await lucia.invalidateUserSessions(token.userId)
		const hashedPassword = await new Argon2id().hash(password)

		await prisma.user.update({
			where: {
				id: token.userId
			},
			data: {
				hashedPassword
			}
		})

		return { success: true }
	}
}
