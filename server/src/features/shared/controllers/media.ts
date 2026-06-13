import { Request, Response } from 'express'
import type { MediaFolder } from '@miayuda/contracts'
import { handleHttpError } from '../../../shared/utils/handleError'
import { saveUploadedFile, getOptimizedMediaUrl } from '../../../shared/services/mediaStorage'
import models from '../../../core/models'

const { storageModel } = models

const ALLOWED_FOLDERS = new Set<MediaFolder>(['evidencias', 'perfiles', 'storage'])

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file
    if (!file) {
      handleHttpError(res, 'Archivo requerido', 400)
      return
    }

    const folderParam = (req.query.folder as string | undefined)?.trim() ?? 'evidencias'
    if (!ALLOWED_FOLDERS.has(folderParam as MediaFolder)) {
      handleHttpError(res, 'Carpeta no válida', 400)
      return
    }

    const folder = folderParam as MediaFolder
    const fileData = await saveUploadedFile(file, folder)
    const saved = await storageModel.create(fileData)

    res.status(201).json({
      storageId: String(saved._id),
      url: saved.url,
      optimizedUrl: getOptimizedMediaUrl(
        { url: saved.url, filename: saved.filename },
        { width: 1200 }
      ),
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNSUPPORTED_MEDIA') {
      res.status(415).json({ code: 'UNSUPPORTED_MEDIA', message: 'Tipo de archivo no permitido' })
      return
    }
    handleHttpError(res, 'Error al subir archivo')
  }
}
