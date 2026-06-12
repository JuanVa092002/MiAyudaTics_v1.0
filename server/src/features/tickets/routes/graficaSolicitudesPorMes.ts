import { Router } from 'express'
import { authMiddleware } from '../../../shared/middleware/session'
import { checkRol } from '../../../shared/middleware/rol'
import { getSolicitudesPorMes } from '../controllers/graficaSolicitudesPorMes'

const router = Router()

router.get('/', authMiddleware, checkRol(['lider']), getSolicitudesPorMes)

export default router
