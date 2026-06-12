export {
  buildEmailLayout,
  getClientUrl,
  getEmailFrom,
  type EmailContent,
  type EmailLayoutOptions,
} from './emailLayout'

export { buildPasswordResetEmail } from './templates/passwordReset'
export { buildSolicitudRegistradaEmail } from './templates/solicitudRegistrada'
export { buildCasoAsignadoEmail } from './templates/casoAsignado'
export { buildCasoCerradoEmail } from './templates/casoCerrado'
export { buildTecnicoAprobadoEmail } from './templates/tecnicoAprobado'
export { buildTecnicoDenegadoEmail } from './templates/tecnicoDenegado'
