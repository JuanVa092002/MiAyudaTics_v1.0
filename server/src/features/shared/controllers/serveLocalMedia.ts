import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { getStorageDir } from '../../../shared/config/storagePaths'

function isSafeFilename(filename: string): boolean {
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false
  }
  return /^[a-zA-Z0-9._-]+$/.test(filename)
}

export const serveLocalMedia = (req: Request, res: Response): void => {
  const raw = req.params.filename
  const filename = Array.isArray(raw) ? raw[0] : raw

  if (!isSafeFilename(filename)) {
    res.status(400).json({ message: 'Nombre de archivo inválido' })
    return
  }

  const filePath = path.join(getStorageDir(), filename)

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: 'Archivo no encontrado' })
    return
  }

  res.sendFile(filePath)
}
