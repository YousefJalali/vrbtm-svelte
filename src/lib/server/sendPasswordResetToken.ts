import { transporter } from './emailTransporter'

export async function sendPasswordResetToken(
  email: string,
  verificationLink: string
) {
  try {
    const info = await transporter.sendMail({
      from: '"Pata - Do Not Reply" <donotreply@pata.com>', // sender address
      to: email, // list of receivers
      subject: 'Reset Password', // Subject line
      html: `<b>Click on the link to reset your password <a href="${verificationLink}">${verificationLink}</a></b>`, // html body
    })

    console.log('Message sent: %s', info.messageId)
  } catch (error) {
    console.log(error)
    throw error
  }
}
