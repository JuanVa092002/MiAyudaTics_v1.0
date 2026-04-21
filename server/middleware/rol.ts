import { Request, Response, NextFunction } from 'express'
import { handleHttpError } from '../utils/handleError'

export const checkRol = (roles: string[]) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { usuario } = req
    if (!usuario) {
      handleHttpError(res, 'usuario no autenticado', 401)
      return
    }

    const checkRolValido = roles.includes(usuario.rol)
    if (!checkRolValido) {
      handleHttpError(res, 'usuario no tiene los permisos', 403)
      return
    }
    next()
  } catch (error) {
    handleHttpError(res, 'error con los permisos', 403)
  }
}
