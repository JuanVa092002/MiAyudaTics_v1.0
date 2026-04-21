import { Router } from 'express'
import { uploadMiddleware } from '../utils/handleStorage'
import {
  createStorage,
  getStorage,
  getStorageId,
  deleteStorage,
  updateStorage,
} from '../controllers/storage'

const router = Router()

// http://localhost:3010/api/storage

router.get('/', getStorage)
router.get('/:id', getStorageId)
router.post('/', uploadMiddleware.single('archivo'), createStorage)
router.put('/:id', uploadMiddleware.single('archivo'), updateStorage)
router.delete('/:id', deleteStorage)

export default router
