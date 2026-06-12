import { Router } from 'express'
import { authMiddleware } from '../../../shared/middleware/session'
import { checkRol } from '../../../shared/middleware/rol'
import { uploadMiddleware } from '../../../shared/utils/handleStorage'
import {
  createStorage,
  getStorage,
  getStorageId,
  deleteStorage,
  updateStorage,
} from '../controllers/storage'

const router = Router()

router.get('/', authMiddleware, checkRol(['lider']), getStorage)
router.get('/:id', authMiddleware, checkRol(['lider', 'tecnico', 'funcionario']), getStorageId)
router.post('/', authMiddleware, checkRol(['lider']), uploadMiddleware.single('archivo'), createStorage)
router.put(
  '/:id',
  authMiddleware,
  checkRol(['lider']),
  uploadMiddleware.single('archivo'),
  updateStorage
)
router.delete('/:id', authMiddleware, checkRol(['lider']), deleteStorage)

export default router
