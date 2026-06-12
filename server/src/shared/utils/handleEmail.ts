import type { SendMailOptions } from 'nodemailer'

interface BrevoRecipient {
  email: string
  name?: string
}

function parseFrom(from: string | undefined): { name: string; email: string } {
  const fallback = process.env.EMAIL_FROM || 'MiAyudaTics <onboarding@brevo.com>'
  const value = from || fallback
  const match = value.match(/^(.+?)\s*<([^>]+)>$/)
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() }
  }
  return { name: 'MiAyudaTics', email: value.trim() }
}

function normalizeRecipients(to: SendMailOptions['to']): BrevoRecipient[] {
  if (!to) return []
  const list = Array.isArray(to) ? to : [to]
  return list.map(entry => {
    if (typeof entry === 'string') {
      const match = entry.match(/^(.+?)\s*<([^>]+)>$/)
      if (match) return { name: match[1].trim(), email: match[2].trim() }
      return { email: entry }
    }
    if ('address' in entry && entry.address) {
      return { email: entry.address, name: entry.name }
    }
    return { email: String(entry) }
  })
}

async function sendViaBrevoApi(mailOptions: SendMailOptions): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    throw new Error('BREVO_API_KEY no configurada')
  }

  const sender = parseFrom(
    typeof mailOptions.from === 'string' ? mailOptions.from : undefined
  )
  const to = normalizeRecipients(mailOptions.to)
  if (to.length === 0) {
    throw new Error('Destinatario (to) requerido')
  }

  const payload: Record<string, unknown> = {
      sender,
      to,
      subject: mailOptions.subject ?? '(sin asunto)',
      htmlContent:
        typeof mailOptions.html === 'string'
          ? mailOptions.html
          : typeof mailOptions.text === 'string'
            ? `<p>${mailOptions.text}</p>`
            : '<p></p>',
    }

  if (typeof mailOptions.text === 'string' && mailOptions.text.trim()) {
    payload.textContent = mailOptions.text
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Brevo API ${response.status}: ${body}`)
  }

  const result = (await response.json()) as { messageId?: string }
  console.log('Correo enviado vía Brevo API: %s', result.messageId ?? 'ok')
}

/**
 * Envía correo usando Brevo REST API (preferido) o SMTP como respaldo.
 */
export const sendMail = async (mailOptions: SendMailOptions): Promise<void> => {
  try {
    if (process.env.BREVO_API_KEY) {
      await sendViaBrevoApi(mailOptions)
      return
    }

    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.default.createTransport({
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASSWORD,
      },
    })

    const info = await transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from || process.env.EMAIL_FROM || 'MiAyudaTics <onboarding@brevo.com>',
    })

    console.log('Correo enviado vía Brevo SMTP: %s', info.messageId)
  } catch (error) {
    console.error('Error al enviar correo con Brevo:', error)
  }
}
