import { buildEmailLayout, getClientUrl, type EmailContent } from '../emailLayout'

export interface SolicitudRegistradaEmailParams {
  nombre: string
  codigoCaso: string
}

export function buildSolicitudRegistradaEmail(
  params: SolicitudRegistradaEmailParams
): EmailContent {
  const clientUrl = getClientUrl()
  return buildEmailLayout({
    pageTitle: 'Registro Solicitud — AyudaTIC',
    icon: '📋',
    recipientName: params.nombre,
    introHtml: `
      <p style="margin:0 0 16px;">
        Cordial saludo. Nos permitimos informarle que su solicitud fue registrada
        en nuestro sistema con el número de caso
        <strong style="color:#04324d;">${params.codigoCaso}</strong>.
      </p>
      <p style="margin:0;">
        Su caso será gestionado en el menor tiempo posible, según los acuerdos de
        solución establecidos para la Mesa de Servicios del CTPI-CAUCA.
      </p>`,
    cta: { label: 'Ingresar al sistema', href: clientUrl },
    alert: {
      tone: 'info',
      title: 'Su solicitud está en proceso de atención.',
      body: 'Recibirá notificaciones cuando cambie el estado de su caso.',
    },
    fallbackLink: clientUrl,
  })
}
