import type { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { getMediaMaxBytes } from '../config/media'

export function handleUploadError(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        code: 'FILE_TOO_LARGE',
        maxBytes: getMediaMaxBytes(),
        message: 'Archivo demasiado grande',
      })
      return
    }
  }

  if (err.message === 'Tipo de archivo no permitido' || err.message === 'UNSUPPORTED_MEDIA') {
    res.status(415).json({
      code: 'UNSUPPORTED_MEDIA',
      message: 'Tipo de archivo no permitido',
    })
    return
  }

  next(err)
}
