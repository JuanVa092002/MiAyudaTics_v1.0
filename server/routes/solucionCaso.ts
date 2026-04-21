import { Router } from 'express'
import { authMiddleware } from '../middleware/session'
import { checkRol } from '../middleware/rol'
import { solucionCaso } from '../controllers/solucionCaso'
import { uploadMiddleware } from '../utils/handleStorage'

const router = Router()

// http://localhost:3010/api/solucionCaso/:id
router.post(
  '/:id',
  authMiddleware,
  checkRol(['tecnico']),
  uploadMiddleware.single('evidencia'),
  solucionCaso
)

export default router
