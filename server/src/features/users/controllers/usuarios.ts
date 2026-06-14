import { Request, Response } from 'express'
import { encrypt } from '../../../shared/utils/handlePassword'
import { handleHttpError } from '../../../shared/utils/handleError'
import models from '../../../core/models'
import { Types } from 'mongoose'
import { deleteStoredMedia, saveUploadedFile } from '../../../shared/services/mediaStorage'
import { DEFAULT_AVATAR_FILENAME, isDefaultAvatar } from '../../../shared/constants/media'

const { usuarioModel, storageModel } = models

export const getUsuarios = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await usuarioModel.find({}).populate('foto')
    res.send({ data })
  } catch (_error) {
    handleHttpError(res, 'error al obtener datos', 500)
  }
}

export const getUsuariosId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const data = await usuarioModel.findById(id).populate('foto')
    if (!data) {
      res.status(404).send({ message: 'Usuario no existe', data: null })
      return
    }
    res.send({ message: 'Usuario consultado exitosamente', data })
  } catch (_error) {
    handleHttpError(res, 'Error al consultar el usuario')
  }
}

export const getPerfilUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.usuario!._id
    const data = await usuarioModel.findById(userId).populate('foto')

    if (!data) {
      res.status(404).send({ message: 'usuario no encontrado' })
      return
    }
    res.send({ message: 'perfil consultado', data })
  } catch (_error) {
    handleHttpError(res, 'Error al consultar el perfil del usuario', 500)
  }
}

export const updateUsuarios = async (req: Request, res: Response): Promise<void> => {
  const userId = req.usuario!._id
  const { body } = req
  const file = req.file

  try {
    delete body.nombre
    delete body.rol
    delete body.correo

    const updatedData: Record<string, unknown> = { ...body }

    const user = await usuarioModel.findById(userId).populate<{
      foto: { _id: Types.ObjectId; filename: string; url: string } | null
    }>('foto')

    if (!user) {
      res.status(404).send({ message: 'Usuario no encontrado' })
      return
    }

    if (body.password) {
      const { confirmPassword, password } = body
      if (confirmPassword !== password) {
        res.status(401).send({ message: 'Las contraseñas no coinciden' })
        return
      }
      updatedData.password = await encrypt(password)
    }

    if (file) {
      if (user.foto && !isDefaultAvatar(user.foto.filename)) {
        await storageModel.findByIdAndDelete(user.foto._id)
        await deleteStoredMedia(user.foto)
      }

      const fileData = await saveUploadedFile(file, 'perfiles')
      const fileSaved = await storageModel.create(fileData)
      updatedData.foto = fileSaved._id
    }

    const data = await usuarioModel.findOneAndUpdate({ _id: userId }, updatedData, { new: true })
    res.status(200).send({ message: `Usuario ${userId} actualizado exitosamente`, data })
  } catch (_error) {
    handleHttpError(res, 'Error al actualizar el usuario', 500)
  }
}

export const inactivarUsuarios = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id

  try {
    const user = await usuarioModel
      .findById(userId)
      .populate<{ foto: { _id: Types.ObjectId; filename: string; url: string } | null }>('foto')

    if (!user) {
      res.status(404).send({ message: 'Usuario no encontrado' })
      return
    }
    if (!user.activo) {
      res.status(404).send({ message: 'Usuario ya esta inactivo' })
      return
    }

    if (user.foto && !isDefaultAvatar(user.foto.filename)) {
      await storageModel.findByIdAndDelete(user.foto._id)
      await deleteStoredMedia(user.foto)
    }

    await usuarioModel.findByIdAndUpdate(userId, { $set: { activo: false }, $unset: { foto: 1 } })

    res.send({ message: `Usuario ${userId} ha sido inactivado` })
  } catch (_error) {
    handleHttpError(res, 'Error al inactivar el usuario', 500)
  }
}

export const reactivarUsuarios = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id

  try {
    const user = await usuarioModel.findById(userId)
    if (!user) {
      res.status(404).send({ message: 'Usuario no encontrado' })
      return
    }
    if (user.activo) {
      res.status(400).send({ message: 'El usuario ya está activo' })
      return
    }

    user.activo = true

    if (!user.foto) {
      const defaultFoto = await storageModel.findOne({ filename: DEFAULT_AVATAR_FILENAME })
      if (defaultFoto) {
        user.foto = defaultFoto._id
      }
    }

    await user.save()
    res.send({ message: `Usuario ${userId} ha sido reactivado` })
  } catch (_error) {
    handleHttpError(res, 'Error al reactivar el usuario', 500)
  }
}

export const usuariosActivos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await usuarioModel
      .find({ activo: true, estado: true, rol: 'tecnico' })
      .select('nombre correo telefono')
    res.send({ data })
  } catch (_error) {
    handleHttpError(res, 'error al obtener datos', 500)
  }
}

export const usuariosInactivos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await usuarioModel
      .find({ activo: false, estado: true })
      .select('nombre correo telefono')
    res.send({ data })
  } catch (_error) {
    handleHttpError(res, 'error al obtener datos', 500)
  }
}


