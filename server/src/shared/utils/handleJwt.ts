import jwt from 'jsonwebtoken'
import { getJwtSecret } from '../config/jwt'
import { JWT_EXPIRES_IN_SECONDS } from '../config/media'
import type { IUsuario } from '../../features/users/models/usuarios'

interface JwtPayload {
  _id: string
  rol: string
}

export const tokenSign = async (usuario: Pick<IUsuario, '_id' | 'rol'>): Promise<string> => {
  return jwt.sign(
    {
      _id: usuario._id,
      rol: usuario.rol,
    },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN_SECONDS }
  )
}

export const verifyToken = async (tokenJwt: string): Promise<JwtPayload | null> => {
  try {
    return jwt.verify(tokenJwt, getJwtSecret()) as JwtPayload
  } catch {
    return null
  }
}
