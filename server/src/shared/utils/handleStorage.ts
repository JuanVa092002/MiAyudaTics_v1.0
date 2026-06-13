import multer from 'multer'
import { getMediaMaxBytes } from '../config/media'

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
])

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: getMediaMaxBytes() },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype.toLowerCase())) {
      cb(null, true)
      return
    }
    cb(new Error('Tipo de archivo no permitido'))
  },
})
