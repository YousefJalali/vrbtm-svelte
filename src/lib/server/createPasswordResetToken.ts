import { TimeSpan, createDate } from 'oslo'
import { sha256 } from 'oslo/crypto'
import { encodeHex } from 'oslo/encoding'
import { generateId } from 'lucia'
import prisma from '$lib/prisma'

export async function createPasswordResetToken(
  userId: string
): Promise<string> {
  // invalidate all existing tokens
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId,
    },
  })

  const tokenId = generateId(40)
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)))
  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt: createDate(new TimeSpan(2, 'h')),
    },
  })

  return tokenId
}
