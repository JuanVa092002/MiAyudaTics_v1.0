import 'dotenv/config'
import { sendMail } from '../../shared/utils/handleEmail'
import {
  buildPasswordResetEmail,
  buildSolicitudRegistradaEmail,
  buildCasoAsignadoEmail,
  buildCasoCerradoEmail,
  buildTecnicoAprobadoEmail,
  buildTecnicoDenegadoEmail,
  getClientUrl,
} from '../../shared/emails'

const templateArg = process.argv[2] ?? 'solicitudRegistrada'

const previews: Record<string, { subject: string; build: () => { html: string; text: string } }> = {
  passwordReset: {
    subject: 'Recuperación de Contraseña — AyudaTIC',
    build: () =>
      buildPasswordResetEmail({
        nombre: 'Usuario de prueba',
        resetLink: `${getClientUrl()}/restablecerPassword/token-demo`,
      }),
  },
  solicitudRegistrada: {
    subject: 'Registro Solicitud — AyudaTIC',
    build: () =>
      buildSolicitudRegistradaEmail({ nombre: 'Usuario de prueba', codigoCaso: 'CASO-DEMO-001' }),
  },
  casoAsignado: {
    subject: 'Asignación de caso — AyudaTIC',
    build: () =>
      buildCasoAsignadoEmail({ nombre: 'Técnico de prueba', codigoCaso: 'CASO-DEMO-001' }),
  },
  casoCerrado: {
    subject: 'Caso Cerrado — AyudaTIC',
    build: () =>
      buildCasoCerradoEmail({ nombre: 'Usuario de prueba', codigoCaso: 'CASO-DEMO-001' }),
  },
  tecnicoAprobado: {
    subject: 'Aprobación de Registro — AyudaTIC',
    build: () => buildTecnicoAprobadoEmail({ nombre: 'Técnico de prueba' }),
  },
  tecnicoDenegado: {
    subject: 'Registro Denegado — AyudaTIC',
    build: () => buildTecnicoDenegadoEmail({ nombre: 'Técnico de prueba' }),
  },
}

async function test() {
  const preview = previews[templateArg]
  if (!preview) {
    console.error(`Plantilla desconocida: ${templateArg}`)
    console.error('Opciones:', Object.keys(previews).join(', '))
    process.exit(1)
  }

  const to = process.env.EMAIL ?? process.env.EMAIL_USER ?? 'test@example.com'
  const { html, text } = preview.build()

  console.log(`Enviando plantilla "${templateArg}" a ${to}...`)
  await sendMail({
    to,
    subject: preview.subject,
    html,
    text,
  })
  console.log('Prueba finalizada.')
}

test()
