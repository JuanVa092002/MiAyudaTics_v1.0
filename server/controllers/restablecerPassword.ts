import { Request, Response } from 'express'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import models from '../models'

const { usuarioModel } = models

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const token = req.params.token as string
  const { password, confirmPassword } = req.body

  try {
    if (password !== confirmPassword) {
      res.status(400).json({ message: 'Las contraseñas no coinciden.' })
      return
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await usuarioModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    })

    if (!user) {
      res.status(400).json({ message: 'Token inválido o expirado.' })
      return
    }

    user.password = await bcrypt.hash(password, 12)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.status(200).json({ message: 'Contraseña restablecida correctamente.' })
  } catch (_error) {
    res.status(500).json({ message: 'Error en el servidor.' })
  }
}
