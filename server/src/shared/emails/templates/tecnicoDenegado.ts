import { buildEmailLayout, type EmailContent } from '../emailLayout'

export interface TecnicoDenegadoEmailParams {
  nombre: string
}

export function buildTecnicoDenegadoEmail(params: TecnicoDenegadoEmailParams): EmailContent {
  return buildEmailLayout({
    pageTitle: 'Registro Denegado — AyudaTIC',
    icon: '⚠️',
    recipientName: params.nombre,
    introHtml: `
      <p style="margin:0 0 16px;">
        Cordial saludo. Lamentamos informarle que su cuenta no ha sido aprobada.
        Es posible que su registro esté incompleto o no cuente con los permisos
        para ingresar a la Mesa de Servicio del CTPI-CAUCA.
      </p>
      <p style="margin:0;">
        Si considera que esto es un error o necesita más información, puede
        contactar al equipo de Mesa de Servicio.
      </p>`,
    alert: {
      tone: 'warning',
      title: 'Su solicitud de registro como técnico no fue aprobada.',
      body: 'Comuníquese con el líder TIC si requiere aclaraciones.',
    },
    footerNoteHtml:
      'Atentamente,<br/>Equipo de Mesa de Servicio CTPI-CAUCA',
  })
}
