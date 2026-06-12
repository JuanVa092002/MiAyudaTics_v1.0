import { buildEmailLayout, type EmailContent } from '../emailLayout'

export interface PasswordResetEmailParams {
  nombre: string
  resetLink: string
}

export function buildPasswordResetEmail(params: PasswordResetEmailParams): EmailContent {
  return buildEmailLayout({
    pageTitle: 'Recuperación de Contraseña — AyudaTIC',
    icon: '🔐',
    recipientName: params.nombre,
    introHtml: `
      <p style="margin:0 0 16px;">
        Recibimos una solicitud para restablecer la contraseña
        de tu cuenta en <strong>AyudaTIC</strong>.
        Si fuiste tú, haz clic en el botón a continuación.
      </p>`,
    cta: { label: 'Restablecer contraseña', href: params.resetLink },
    alert: {
      tone: 'warning',
      title: '⏱ Este enlace expira en <strong>1 hora</strong>.',
      body: 'Si ya expiró, solicita uno nuevo desde la página de inicio de sesión.',
    },
    footerNoteHtml:
      'Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña actual permanecerá sin cambios.',
    fallbackLink: params.resetLink,
  })
}
