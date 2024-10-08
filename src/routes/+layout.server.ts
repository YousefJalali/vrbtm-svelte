import prisma from '$lib/prisma'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	let user = null

	if (event?.locals?.user) {
		user = await prisma.user.findUnique({
			where: {
				id: event.locals.user.id
			},
			select: {
				id: true,
				name: true,
				emailVerified: true
			}
		})
	}

	return {
		user
	}
}
