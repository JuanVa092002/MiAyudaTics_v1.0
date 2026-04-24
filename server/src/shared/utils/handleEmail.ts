import dotenv from 'dotenv'
import path from 'path'
import nodemailer from 'nodemailer'
import { SendMailOptions } from 'nodemailer'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

/**
 * Enviar correo electrnico usando Brevo (SMTP)
 * Configurado para portafolio: permite enviar a cualquier destinatario en capa gratuita.
 * @param mailOptions Opciones del correo
 */
export const sendMail = async (mailOptions: SendMailOptions): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASSWORD,
      },
    })

    const info = await transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from || process.env.EMAIL_FROM || 'MiAyudaTics <onboarding@brevo.com>',
    })

    console.log('Correo electrnico enviado exitosamente va Brevo: %s', info.messageId)
  } catch (error) {
    console.error('Error al enviar correo electrnico con Brevo:', error)
  }
}

