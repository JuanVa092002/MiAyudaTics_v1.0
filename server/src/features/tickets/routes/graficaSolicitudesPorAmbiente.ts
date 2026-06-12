import { Router } from 'express'
import { authMiddleware } from '../../../shared/middleware/session'
import { checkRol } from '../../../shared/middleware/rol'
import { getSolicitudesPorAmbientes } from '../controllers/graficaSolicitudesPorAmbiente'

const router = Router()

router.get('/', authMiddleware, checkRol(['lider']), getSolicitudesPorAmbientes)

export default router
