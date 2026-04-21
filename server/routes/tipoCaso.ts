import { Router } from 'express'
import { checkRol } from '../middleware/rol'
import { authMiddleware } from '../middleware/session'
import {
  getTipoCaso,
  getTipoCasoId,
  postTipoCaso,
  updateTipoCaso,
  deleteTipoCaso,
} from '../controllers/tipoCaso'

const router = Router()

// http://localhost:3010/api/tipoCaso/

router.get('/', authMiddleware, checkRol(['lider', 'tecnico']), getTipoCaso)
router.get('/:id', authMiddleware, checkRol(['lider', 'tecnico']), getTipoCasoId)
router.post('/', authMiddleware, checkRol(['lider']), postTipoCaso)
router.put('/:id', authMiddleware, checkRol(['lider']), updateTipoCaso)
router.delete('/:id', authMiddleware, checkRol(['lider']), deleteTipoCaso)

export default router
