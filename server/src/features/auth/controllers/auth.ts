import { Request, Response } from 'express'
import { encrypt, compare } from '../../../shared/utils/handlePassword'
import models from '../../../core/models'
import { tokenSign } from '../../../shared/utils/handleJwt'
import { handleHttpError } from '../../../shared/utils/handleError'
import jwt from 'jsonwebtoken'

const { usuarioModel, storageModel } = models
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3010'
// RENDER_URL referenced but not used in this file directly
// const RENDER_URL = process.env.RENDER_URL

export const registerCtrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password, confirmPassword, rol, correo, ...rest } = req.body

    if (rol === 'lider') {
      const liderExistente = await usuarioModel.findOne({ rol: 'lider' })
      if (liderExistente) {
        res.status(400).send({
          message:
            'Ya existe un usuario con el rol de Lider TIC. No se permiten múltiples registros con este rol.',
        })
        return
      }
    }

    const correoExiste = await usuarioModel.findOne({ correo })
    if (correoExiste) {
      res.status(400).send({ message: 'correo ya se encuentra registrado' })
      return
    }

    if (confirmPassword !== password) {
      res.status(401).send({ message: 'Las contraseñas no coinciden' })
      return
    }

    const passwordHash = await encrypt(password)
    const body = { ...rest, password: passwordHash, rol, correo }

    const fileSaved = await storageModel.findOne({ filename: 'usuario-undefined.png' })
    if (!fileSaved) {
      res.status(500).send({ message: 'foto predeterminada no encontrada' })
      return
    }

    const userData = {
      ...body,
      foto: fileSaved._id,
    }

    const dataUser = await usuarioModel.create(userData)
    dataUser.password = undefined

    const data = {
      token: await tokenSign(dataUser),
      user: dataUser,
    }

    const message =
      rol === 'tecnico'
        ? 'Usuario registrado exitosamente. Su cuenta está en espera de aprobación por el Líder TIC.'
        : 'Usuario registrado exitosamente.'

    res.json({ message, data })
  } catch (_error) {
    res.status(400).send({ message: 'correo ya se encuentra registrado' })
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
      handleHttpError(res, 'usuario no existe', 404)
      return
    }

    if (user.rol === 'tecnico' && user.estado === false) {
      res.status(403).send({
        message: `Su registro se encuentra sujeto a aprobación por parte del Líder TIC. Una vez sea aprobado, podrá ingresar al sistema. ¡Gracias!`,
      })
      return
    }

    if (user.rol === 'tecnico' && user.activo === false) {
      res.status(403).send({
        message: `En el momento su ingreso se encuentra inactivado por parte del Líder TIC. Una vez sea reactivado, podrá ingresar al sistema. ¡Gracias!`,
      })
      return
    }

    const passwordSave = user.password as string
    const check = await compare(password, passwordSave)

    if (!check) {
      handleHttpError(res, 'contraseña incorrecta', 401)
      return
    }

    user.set('password', undefined, { strict: false })
    const token = await tokenSign(user)
    const dataUser = { token, user }

    res.cookie('token', token, {
      secure: true,
      sameSite: 'none',
      httpOnly: false,
    })

    res.json({ message: 'Usuario ha ingresado exitosamente', dataUser })
  } catch (error) {
    const err = error as Error
    res.status(500).json({
      message: 'Error al registrar el usuario.',
      error: err.message,
    })
  }
}

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.cookies

  try {
    if (!token) {
      res.status(400).json({ message: 'Sin autorizacion' })
      return
    }

    jwt.verify(token, process.env.JWT_SECRET as string, async (err: jwt.VerifyErrors | null, user: unknown) => {
      if (err) {
        res.status(400).json({ message: err })
        return
      }
      const payload = user as { _id: string }
      const foundUser = await usuarioModel.findOne({ _id: payload._id }).populate('foto')
      if (!foundUser) {
        res.status(400).json({ message: 'Usuario no encontrado.' })
        return
      }
      res.status(200).json(foundUser)
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({
      message: 'Error al verificar el token',
      error: err.message,
    })
  }
}

export const createLogout = (_req: Request, res: Response): void => {
  try {
    res.cookie('token', '', {
      expires: new Date(0),
    })
    res.status(200).json({ message: 'Sesion cerrada exitosamente!' })
  } catch (error) {
    const err = error as Error
    res.status(500).json({
      message: 'Error al cerrar la sesion',
      error: err.message,
    })
  }
}

/* PUBLIC_URL kept for potential future use in this controller */
void PUBLIC_URL

