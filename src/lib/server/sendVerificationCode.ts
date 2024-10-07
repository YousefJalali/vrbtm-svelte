import { transporter } from './emailTransporter'

export async function sendVerificationCode(
  email: string,
  verificationCode: string
) {
  try {
    const info = await transporter.sendMail({
      from: '"Pata - Do Not Reply" <donotreply@pata.com>', // sender address
      to: email, // list of receivers
      subject: 'OTP', // Subject line
      text: `Your OTPP is ${verificationCode}`, // plain text body
      html: `<b>Your OTP is ${verificationCode}</b>`, // html body
    })

    console.log('Message sent: %s', info.messageId)
  } catch (error) {
    console.log(error)
    throw error
  }
}
