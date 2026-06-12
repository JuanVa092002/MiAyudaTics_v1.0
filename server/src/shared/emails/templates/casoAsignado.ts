import { buildEmailLayout, getClientUrl, type EmailContent } from '../emailLayout'

export interface CasoAsignadoEmailParams {
  nombre: string
  codigoCaso: string
}

export function buildCasoAsignadoEmail(params: CasoAsignadoEmailParams): EmailContent {
  const clientUrl = getClientUrl()
  return buildEmailLayout({
    pageTitle: 'Asignación de caso — AyudaTIC',
    icon: '🛠️',
    recipientName: params.nombre,
    introHtml: `
      <p style="margin:0 0 16px;">
        Cordial saludo. Nos permitimos informarle que le ha sido asignada la
        solicitud con el código de caso
        <strong style="color:#04324d;">${params.codigoCaso}</strong>.
      </p>
      <p style="margin:0;">
        Por favor ingrese al sistema para revisar los detalles y dar seguimiento
        a la solicitud asignada.
      </p>`,
    cta: { label: 'Ver mis casos', href: clientUrl },
    fallbackLink: clientUrl,
    footerNoteHtml:
      'Atentamente,<br/>Equipo de Mesa de Servicios<br/>CTPI-CAUCA',
  })
}
