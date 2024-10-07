import prisma from '$lib/prisma'
import { TimeSpan, createDate } from 'oslo'
import { generateRandomString, alphabet } from 'oslo/crypto'

export async function generateEmailVerificationCode(
  userId: string,
  email: string
): Promise<string> {
  await prisma.verificationCode.deleteMany({
    where: {
      userId: userId,
    },
  })

  const code = generateRandomString(4, alphabet('0-9'))
  await prisma.verificationCode.create({
    data: {
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(5, 'm')),
    },
  })

  return code
}
