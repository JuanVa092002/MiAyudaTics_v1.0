import { Router } from 'express'
import { authMiddleware } from '../middleware/session'
import { checkRol } from '../middleware/rol'
import {
  getAmbiente,
  getAmbienteId,
  postAmbiente,
  updateAmbiente,
  inactivarAmbiente,
} from '../controllers/ambienteFormacion'

const router = Router()

// http://localhost:3010/api/ambienteFormacion/
// http://localhost:3010/api/ambienteFormacion/:id/inactivar

router.get('/', authMiddleware, checkRol(['lider', 'funcionario']), getAmbiente)
router.get('/:id', authMiddleware, checkRol(['lider', 'funcionario']), getAmbienteId)
router.post('/', authMiddleware, checkRol(['lider']), postAmbiente)
router.put('/:id', authMiddleware, checkRol(['lider']), updateAmbiente)
router.put('/:id/inactivar', authMiddleware, checkRol(['lider']), inactivarAmbiente)

export default router
