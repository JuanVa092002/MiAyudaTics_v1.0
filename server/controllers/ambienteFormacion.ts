import { Request, Response } from 'express'
import { handleHttpError } from '../utils/handleError'
import models from '../models'

const { ambienteModel } = models

export const getAmbiente = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await ambienteModel.find({ activo: true })
    res.send({ data })
  } catch (_error) {
    handleHttpError(res, 'Error al obtener datos de ambiente de formación')
  }
}

export const getAmbienteId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const data = await ambienteModel.findOne({ _id: id })
    if (!data) {
      handleHttpError(res, 'Ambiente de formación no encontrado', 404)
      return
    }
    res.send({ message: 'Ambiente de formación consultado exitosamente', data })
  } catch (_error) {
    handleHttpError(res, 'Error al consultar el ambiente de formación')
  }
}

export const postAmbiente = async (req: Request, res: Response): Promise<void> => {
  const { body } = req
  try {
    const data = await ambienteModel.create(body)
    res.send({ message: 'Ambiente de formación registrado exitosamente', data })
  } catch (_error) {
    handleHttpError(res, 'Error al registrar el ambiente de formación')
  }
}

export const updateAmbiente = async (req: Request, res: Response): Promise<void> => {
  const ambienteId = req.params.id
  const { body } = req
  try {
    const data = await ambienteModel.findOneAndUpdate(
      { _id: ambienteId, activo: true },
      { ...body },
      { new: true }
    )
    if (!data) {
      handleHttpError(res, 'Ambiente de formación no encontrado', 404)
      return
    }
    res.send({ message: `Ambiente de formación ${ambienteId} actualizado exitosamente`, data })
  } catch (_error) {
    handleHttpError(res, 'Error al actualizar el ambiente de formación')
  }
}

export const inactivarAmbiente = async (req: Request, res: Response): Promise<void> => {
  const ambienteId = req.params.id
  try {
    const data = await ambienteModel.findOneAndUpdate(
      { _id: ambienteId },
      { activo: false },
      { new: true }
    )
    if (!data) {
      handleHttpError(res, 'Ambiente de formación no encontrado', 404)
      return
    }
    res.send({ message: `Ambiente de formación ${ambienteId} desactivado exitosamente`, data })
  } catch (_error) {
    handleHttpError(res, 'Error al desactivar el ambiente de formación')
  }
}
