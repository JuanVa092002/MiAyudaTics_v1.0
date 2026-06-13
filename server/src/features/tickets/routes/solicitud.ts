import { Router } from 'express'
import { authMiddleware } from '../../../shared/middleware/session'
import { checkRol } from '../../../shared/middleware/rol'
import {
  getSolicitudId,
  getSolicitud,
  getHistorialSolicitud,
  getSolicitudesPendientes,
  crearSolicitud,
  historialSolicitudesCreadas,
  asignarTecnicoSolicitud,
  getSolicitudesAsignadas,
  getSolicitudesFinalizadas,
  deleteSolicitud,
} from '../controllers/solicitud'
import { uploadMiddleware } from '../../../shared/utils/handleStorage'
import { handleUploadError } from '../../../shared/middleware/uploadError'
import { uploadLimiter } from '../../../shared/config/rateLimit'
import { validarSolicitud } from '../../../shared/validators/solicitud'

const router = Router()

router.get('/', authMiddleware, checkRol(['lider']), getSolicitud)

router.get('/historialSolicitudes', authMiddleware, checkRol(['lider']), getHistorialSolicitud)

router.get('/pendientes', authMiddleware, checkRol(['lider']), getSolicitudesPendientes)

router.get('/asignadas', authMiddleware, checkRol(['tecnico']), getSolicitudesAsignadas)

router.get('/finalizadas', authMiddleware, checkRol(['tecnico']), getSolicitudesFinalizadas)

router.get('/historial', authMiddleware, checkRol(['funcionario']), historialSolicitudesCreadas)

router.post(
  '/',
  authMiddleware,
  checkRol(['funcionario']),
  uploadLimiter,
  uploadMiddleware.single('foto'),
  handleUploadError,
  validarSolicitud,
  crearSolicitud
)

router.get('/:id', authMiddleware, checkRol(['lider', 'tecnico', 'funcionario']), getSolicitudId)
router.delete('/:id', authMiddleware, checkRol(['lider']), deleteSolicitud)

router.put('/:id/asignarTecnico', authMiddleware, checkRol(['lider']), asignarTecnicoSolicitud)

export default router
