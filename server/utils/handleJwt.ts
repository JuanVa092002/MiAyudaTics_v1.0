import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret' // definir JWT_SECRET en archivo .env

export const tokenSign = async (usuario: any): Promise<string> => {
  const sign = jwt.sign(
    // payload
    {
      _id: usuario._id,
      rol: usuario.rol,
    },
    JWT_SECRET,
    { expiresIn: '2h' } // tiempo de expiración del token
  )
  return sign
}

export const verifyToken = async (tokenJwt: string): Promise<any | null> => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET)
  } catch (error) {
    return null
  }
}
