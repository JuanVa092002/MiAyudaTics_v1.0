import { Request, Response, NextFunction } from 'express'
import { handleHttpError } from '../utils/handleError'
import { verifyToken } from '../utils/handleJwt'
import models from '../models'
const { usuarioModel } = models

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.headers.authorization) {
      handleHttpError(res, 'error en inicio de sesion, no cuenta con token', 401)
      return
    }

    const token = req.headers.authorization.split(' ').pop() as string
    const dataToken: any = await verifyToken(token)

    if (!dataToken?._id) {
      handleHttpError(res, 'error en inicio de sesion', 401)
      return
    }

    const usuario = await usuarioModel.findById(dataToken._id)
    req.usuario = usuario

    console.log('Usuario autenticado:', req.usuario)

    next()
  } catch (error) {
    handleHttpError(res, 'error en inicio de sesion', 401)
  }
}
