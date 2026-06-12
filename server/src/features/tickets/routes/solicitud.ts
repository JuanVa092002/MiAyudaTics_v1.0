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
import { validarSolicitud } from '../../../shared/validators/solicitud'

const router = Router()

// http://localhost:3010/api/solicitud/
router.get('/', authMiddleware, checkRol(['lider']), getSolicitud)

// http://localhost:3010/api/solicitud/historialSolicitudes (lider)
router.get('/historialSolicitudes', authMiddleware, checkRol(['lider']), getHistorialSolicitud)

// http://localhost:3010/api/solicitud/pendientes (lider)
router.get('/pendientes', authMiddleware, checkRol(['lider']), getSolicitudesPendientes)

// http://localhost:3010/api/solicitud/asignadas (tecnico)
router.get('/asignadas', authMiddleware, checkRol(['tecnico']), getSolicitudesAsignadas)

// http://localhost:3010/api/solicitud/finalizadas (tecnico)
router.get('/finalizadas', authMiddleware, checkRol(['tecnico']), getSolicitudesFinalizadas)

// http://localhost:3010/api/solicitud/historial (funcionario)
router.get('/historial', authMiddleware, checkRol(['funcionario']), historialSolicitudesCreadas)

// http://localhost:3010/api/solicitud/ (funcionario)
router.post(
  '/',
  authMiddleware,
  checkRol(['funcionario']),
  uploadMiddleware.single('foto'),
  validarSolicitud,
  crearSolicitud
)

router.get('/:id', authMiddleware, checkRol(['lider', 'tecnico', 'funcionario']), getSolicitudId)
router.delete('/:id', authMiddleware, checkRol(['lider']), deleteSolicitud)

// http://localhost:3010/api/solicitud/:id/asignarTecnico (lider)
router.put('/:id/asignarTecnico', authMiddleware, checkRol(['lider']), asignarTecnicoSolicitud)

export default router

