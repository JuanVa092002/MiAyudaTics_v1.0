import { Request, Response } from 'express'
import crypto from 'crypto'
import { sendMail } from '../../../shared/utils/handleEmail'
import {
  buildPasswordResetEmail,
  getClientUrl,
  getEmailFrom,
} from '../../../shared/emails'
import models from '../../../core/models'

const { usuarioModel } = models

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

    const resetLink = `${getClientUrl()}/restablecerPassword/${token}`
    const { html, text } = buildPasswordResetEmail({
      nombre: user.nombre ?? 'usuario',
      resetLink,
    })

    await sendMail({
      from: getEmailFrom(),
      to: user.correo,
      subject: 'Recuperación de Contraseña — AyudaTIC',
      text,
      html,
    })

    res.send({ message: 'Correo electrónico enviado' })
  } catch (_error) {
    res.status(500).send({ message: 'Error al enviar el correo electrónico' })
  }
}
