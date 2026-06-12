import { buildEmailLayout, getClientUrl, type EmailContent } from '../emailLayout'

export interface TecnicoAprobadoEmailParams {
  nombre: string
}

export function buildTecnicoAprobadoEmail(params: TecnicoAprobadoEmailParams): EmailContent {
  const clientUrl = getClientUrl()
  return buildEmailLayout({
    pageTitle: 'Aprobación de Registro — AyudaTIC',
    icon: '✓',
    recipientName: params.nombre,
    introHtml: `
      <p style="margin:0 0 16px;">
        Cordial saludo. Nos complace informarle que su cuenta ha sido aprobada y
        ahora tiene acceso al sistema de Mesa de Servicio del CTPI-CAUCA.
      </p>
      <p style="margin:0;">
        Puede ingresar al sistema utilizando el enlace a continuación.
      </p>`,
    cta: { label: 'Ingresar al sistema', href: clientUrl },
    alert: {
      tone: 'success',
      title: '✓ Su registro como técnico ha sido aprobado.',
    },
    fallbackLink: clientUrl,
    footerNoteHtml:
      'Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.<br/><br/>Atentamente,<br/>Equipo de Mesa de Servicio CTPI-CAUCA',
  })
}
