import dotenv from 'dotenv'
import path from 'path'
import nodemailer from 'nodemailer'
import { SendMailOptions } from 'nodemailer'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

export const sendMail = async (mailOptions: SendMailOptions): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // 'false' para STARTTLS
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const info = await transporter.sendMail(mailOptions)
    console.log('Correo electrónico enviado: %s', info.messageId)
  } catch (error) {
    console.error('Error al enviar correo electrónico:', error)
  }
}
