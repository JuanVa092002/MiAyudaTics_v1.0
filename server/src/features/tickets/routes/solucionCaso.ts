import { Router } from 'express'
import { authMiddleware } from '../../../shared/middleware/session'
import { checkRol } from '../../../shared/middleware/rol'
import { solucionCaso } from '../controllers/solucionCaso'
import { uploadMiddleware } from '../../../shared/utils/handleStorage'

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

