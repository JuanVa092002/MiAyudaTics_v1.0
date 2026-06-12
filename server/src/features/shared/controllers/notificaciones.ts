import { Request, Response } from 'express'
import Notificacion from '../models/notificaciones'

export const getNotificaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.usuario!._id
    const notificaciones = await Notificacion.find({
      usuario: userId,
      leido: false,
    }).sort({ createdAt: -1 })

    res.status(200).json(notificaciones)
  } catch (error) {
    const err = error as Error
    res.status(500).json({ message: err.message })
  }
}

export const marcarComoLeida = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.usuario!._id.toString()

    const notificacion = await Notificacion.findById(id)
    if (!notificacion) {
      res.status(404).json({ message: 'Notificación no encontrada' })
      return
    }

    if (notificacion.usuario.toString() !== userId) {
      res.status(403).json({ message: 'No autorizado para modificar esta notificación' })
      return
    }

    notificacion.leido = true
    await notificacion.save()

    res.status(200).json(notificacion)
  } catch (error) {
    const err = error as Error
    res.status(500).json({ message: err.message })
  }
}

export const marcarTodasComoLeidas = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.usuario!._id
    await Notificacion.updateMany({ usuario: userId, leido: false }, { leido: true })

    res.status(200).json({ message: 'Todas las notificaciones marcadas como leídas' })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ message: err.message })
  }
}
