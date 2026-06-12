import { Request, Response } from 'express'
import { encrypt, compare } from '../../../shared/utils/handlePassword'
import models from '../../../core/models'
import { tokenSign } from '../../../shared/utils/handleJwt'
import { getJwtSecret } from '../../../shared/config/jwt'
import { handleHttpError } from '../../../shared/utils/handleError'
import { getAuthCookieOptions, getClearAuthCookieOptions } from '../../../shared/utils/cookieOptions'
import { rejectInactiveAccount } from '../../../shared/middleware/accountStatus'
import jwt from 'jsonwebtoken'
import type { RegisterDto } from '../../../shared/validators/auth'

import { DEFAULT_AVATAR_FILENAME } from '../../../shared/constants/media'

const { usuarioModel, storageModel } = models

export const registerCtrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password, confirmPassword, rol, correo, nombre, telefono } = req.body as RegisterDto & {
      confirmPassword?: string
    }

    if (confirmPassword !== password) {
      res.status(401).send({ message: 'Las contraseñas no coinciden' })
      return
    }

    const correoExiste = await usuarioModel.findOne({ correo })
    if (correoExiste) {
      res.status(400).send({ message: 'correo ya se encuentra registrado' })
      return
    }

    const passwordHash = await encrypt(password)
    const fileSaved = await storageModel.findOne({ filename: DEFAULT_AVATAR_FILENAME })
    if (!fileSaved) {
      res.status(500).send({ message: 'foto predeterminada no encontrada' })
      return
    }

    const userData = {
      nombre,
      correo,
      rol,
      telefono,
      password: passwordHash,
      foto: fileSaved._id,
      activo: rol === 'funcionario',
      estado: rol === 'funcionario',
    }

    const dataUser = await usuarioModel.create(userData)
    dataUser.password = undefined

    const message =
      rol === 'tecnico'
        ? 'Usuario registrado exitosamente. Su cuenta está en espera de aprobación por el Líder TIC.'
        : 'Usuario registrado exitosamente.'

    if (rol === 'tecnico') {
      res.json({ message })
      return
    }

    const token = await tokenSign(dataUser)
    res.cookie('token', token, getAuthCookieOptions())
    res.json({ message, data: { token, user: dataUser } })
  } catch (_error) {
    res.status(400).send({ message: 'Error al registrar el usuario' })
  }
}

export const loginCtrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo, password } = req.body

    const user = await usuarioModel
      .findOne({ correo })
      .select('password correo rol estado activo nombre foto')
      .populate('foto', 'url')

    if (!user) {
      handleHttpError(res, 'credenciales inválidas', 401)
      return
    }

    if (rejectInactiveAccount(res, user)) {
      return
    }

    const passwordSave = user.password as string
    const check = await compare(password, passwordSave)

    if (!check) {
      handleHttpError(res, 'credenciales inválidas', 401)
      return
    }

    user.set('password', undefined, { strict: false })
    const token = await tokenSign(user)
    const dataUser = { token, user }

    res.cookie('token', token, getAuthCookieOptions())
    res.json({ message: 'Usuario ha ingresado exitosamente', dataUser })
  } catch (_error) {
    handleHttpError(res, 'Error al iniciar sesión', 500)
  }
}

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.token as string | undefined

  try {
    if (!token) {
      res.status(401).json({ message: 'Sin autorizacion' })
      return
    }

    jwt.verify(token, getJwtSecret(), async (err: jwt.VerifyErrors | null, payload: unknown) => {
      if (err) {
        res.status(401).json({ message: 'Token inválido o expirado' })
        return
      }
      const { _id } = payload as { _id: string }
      const foundUser = await usuarioModel.findOne({ _id }).populate('foto')
      if (!foundUser) {
        res.status(401).json({ message: 'Usuario no encontrado.' })
        return
      }
      if (!foundUser.activo || (foundUser.rol === 'tecnico' && !foundUser.estado)) {
        res.status(403).json({ message: 'Cuenta inactiva o pendiente de aprobación.' })
        return
      }
      res.status(200).json(foundUser)
    })
  } catch (_error) {
    handleHttpError(res, 'Error al verificar el token', 500)
  }
}

export const createLogout = (_req: Request, res: Response): void => {
  try {
    res.cookie('token', '', getClearAuthCookieOptions())
    res.status(200).json({ message: 'Sesion cerrada exitosamente!' })
  } catch (_error) {
    handleHttpError(res, 'Error al cerrar la sesion', 500)
  }
}
