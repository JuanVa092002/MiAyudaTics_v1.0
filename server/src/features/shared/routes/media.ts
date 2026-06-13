import { Router } from 'express'
import { authMiddleware } from '../../../shared/middleware/session'
import { uploadMiddleware } from '../../../shared/utils/handleStorage'
import { handleUploadError } from '../../../shared/middleware/uploadError'
import { uploadLimiter } from '../../../shared/config/rateLimit'
import { uploadMedia } from '../controllers/media'

const router = Router()

router.post(
  '/upload',
  authMiddleware,
  uploadLimiter,
  uploadMiddleware.single('file'),
  handleUploadError,
  uploadMedia
)

export default router
