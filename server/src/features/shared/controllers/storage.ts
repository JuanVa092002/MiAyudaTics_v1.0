import { Request, Response } from 'express'
import { handleHttpError } from '../../../shared/utils/handleError'
import fs from 'fs'
import path from 'path'
import models from '../../../core/models'

const { storageModel } = models
const PUBLIC_URL = process.env.PUBLIC_URL
const RENDER_URL = process.env.RENDER_URL

export const createStorage = async (req: Request, res: Response): Promise<void> => {
  const { file } = req
  if (!file) {
    res.status(400).send({ message: 'archivo no cargado' })
    return
  }

  const fileData = {
    filename: file.filename,
    url: `${PUBLIC_URL}/${file.filename}`,
  }

  try {
    const data = await storageModel.create(fileData)
    res.status(201).send({ message: 'archivo creado exitosamente', file: data })
  } catch (_error) {
    handleHttpError(res, 'Error al crear archivo')
  }
}

export const getStorage = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await storageModel.find({})
    res.send({ data })
  } catch (_error) {
    handleHttpError(res, 'error al obtener datos')
  }
}

export const getStorageId = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  try {
    const data = await storageModel.findById(id)
    if (!data) {
      handleHttpError(res, 'Archivo no encontrado', 404)
      return
    }
    res.send({ data })
  } catch (_error) {
    handleHttpError(res, 'error al obtener datos')
  }
}

export const updateStorage = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  const { body } = req
  const file = req.file

  try {
    const storageData = await storageModel.findById(id)
    if (!storageData) {
      handleHttpError(res, 'Archivo no encontrado', 404)
      return
    }

    const updateData: Record<string, string> = { ...body }

    if (file) {
      const pathStorage = path.join(__dirname, '../storage', storageData.filename)

      updateData.filename = file.filename
      updateData.url = `${RENDER_URL}/${file.filename}`

      fs.unlink(pathStorage, err => {
        if (err) {
          handleHttpError(res, 'Error al eliminar el archivo físico')
        }
      })
    }

    const data = await storageModel.findOneAndUpdate({ _id: id }, updateData, { new: true })
    res.send({ message: `Archivo ${id} actualizado exitosamente`, data })
  } catch (_error) {
    handleHttpError(res, 'Error al actualizar archivo')
  }
}

export const deleteStorage = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  try {
    const data = await storageModel.findByIdAndDelete(id)
    if (!data) {
      handleHttpError(res, 'Archivo no encontrado', 404)
      return
    }

    const pathStorage = path.join(__dirname, '../storage', data.filename)

    fs.unlink(pathStorage, err => {
      if (err) {
        handleHttpError(res, 'Error al eliminar el archivo físico')
        return
      }
      res.send({ message: `Archivo ${id} eliminado correctamente` })
    })
  } catch (_error) {
    handleHttpError(res, 'Error al eliminar la imagen')
  }
}

