import { Request, Response } from 'express'
import crypto from 'crypto'
import { sendMail } from '../utils/handleEmail'
import models from '../models'

const { usuarioModel } = models
const RENDER_URL = process.env.RENDER_URL

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo } = req.body
    if (!correo) {
      res.status(400).send({ message: 'Correo electrónico es requerido' })
      return
    }

    const user = await usuarioModel.findOne({ correo })
    if (!user) {
      res.status(404).send({ message: 'Usuario no encontrado' })
      return
    }

    const token = generateToken()
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hora
    await user.save()

    const resetUrl = `${RENDER_URL}/api/restablecerPassword/${token}`

    await sendMail({
      from: process.env.EMAIL_USER,
      to: user.correo,
      subject: 'Recuperación de Contraseña',
      text: `Hola ${user.nombre},\n\nPara restablecer tu contraseña, por favor visita el siguiente enlace: \n\n${resetUrl}`,
    })

    res.send({ message: 'Correo electrónico enviado' })
  } catch (_error) {
    res.status(500).send({ message: 'Error al enviar el correo electrónico' })
  }
}
