import nodemailer from 'nodemailer'
import { GMAIL, GMAIL_APP_PASSWORD } from '$env/static/private'

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: GMAIL,
    pass: GMAIL_APP_PASSWORD,
  },
})
