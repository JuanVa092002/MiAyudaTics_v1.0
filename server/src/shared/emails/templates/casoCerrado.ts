import { buildEmailLayout, getClientUrl, type EmailContent } from '../emailLayout'

export interface CasoCerradoEmailParams {
  nombre: string
  codigoCaso: string
}

export function buildCasoCerradoEmail(params: CasoCerradoEmailParams): EmailContent {
  const clientUrl = getClientUrl()
  return buildEmailLayout({
    pageTitle: 'Caso Cerrado — AyudaTIC',
    icon: '✅',
    recipientName: params.nombre,
    introHtml: `
      <p style="margin:0 0 16px;">
        Cordial saludo. Nos permitimos informarle que su caso con código
        <strong style="color:#04324d;">${params.codigoCaso}</strong>
        ha sido cerrado con éxito.
      </p>
      <p style="margin:0;">
        Gracias por utilizar nuestro servicio de Mesa de Ayuda. Si tiene alguna
        otra solicitud, no dude en contactarnos.
      </p>`,
    cta: { label: 'Ingresar al sistema', href: clientUrl },
    alert: {
      tone: 'success',
      title: '✓ Caso finalizado correctamente.',
    },
    fallbackLink: clientUrl,
    footerNoteHtml:
      'Atentamente,<br/>Equipo de Mesa de Servicio — CTPI-CAUCA',
  })
}
