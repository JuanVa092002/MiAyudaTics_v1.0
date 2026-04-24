import { Request, Response, NextFunction } from 'express'
import { handleHttpError } from '../utils/handleError'
import { verifyToken } from '../utils/handleJwt'
import models from '../../core/models'
const { usuarioModel } = models

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Obtener token desde cookie (HttpOnly) o encabezado Authorization
    const token = (req as any).cookies?.token || (req.headers.authorization ? req.headers.authorization.split(' ').pop() : undefined);
    if (!token) {
      handleHttpError(res, 'error en inicio de sesion, no cuenta con token', 401);
      return;
    }
    const dataToken: any = await verifyToken(token)

    if (!dataToken?._id) {
      handleHttpError(res, 'error en inicio de sesion', 401)
      return
    }

    const usuario = await usuarioModel.findById(dataToken._id)
    if (!usuario) {
      handleHttpError(res, 'usuario no encontrado', 401)
      return
    }
    req.usuario = usuario

    console.log('Usuario autenticado:', req.usuario)

    next()
  } catch (error) {
    handleHttpError(res, 'error en inicio de sesion', 401)
  }
}

