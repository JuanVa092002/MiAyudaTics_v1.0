import dotenv from 'dotenv'
import path from 'path'
import { Resend } from 'resend'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Interfaz para las opciones de correo electrónico (compatible con el uso previo de nodemailer)
 */
interface MailOptions {
  from?: string
  to: string | string[]
  subject: string
  text?: string
  html?: string
}

/**
 * Enviar correo electrónico usando Resend
 * @param mailOptions Opciones del correo
 */
export const sendMail = async (mailOptions: MailOptions): Promise<void> => {
  try {
    const { from, to, subject, text, html } = mailOptions

    const { data, error } = await resend.emails.send({
      from: from || process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: Array.isArray(to) ? to : [to],
      subject,
      text: text || '',
      html: html || text || '',
    })

    if (error) {
      console.error('Error de Resend al enviar correo:', error)
      return
    }

    console.log('Correo electrónico enviado exitosamente vía Resend:', data?.id)
  } catch (error) {
    console.error('Error fatal al enviar correo electrónico:', error)
  }
}
