import { Request, Response } from 'express'
import { handleHttpError } from '../../../shared/utils/handleError'
import { sendMail } from '../../../shared/utils/handleEmail'
import { io } from '../../../shared/utils/handleSocket'
import models from '../../../core/models'
import { Types } from 'mongoose'
import Notificacion from '../../shared/models/notificaciones'

const { solicitudModel, storageModel, usuarioModel, solucionCasoModel } = models
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3010'

export const solucionCaso = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const { body } = req
  const file = req.file

  try {
    const solicitud = await solicitudModel.findById(id)
    if (!solicitud) {
      res.status(404).send({ message: 'Solicitud no encontrada' })
      return
    }

    let fotoId: Types.ObjectId | undefined

    if (file) {
      const fileData = {
        filename: file.filename,
        url: `${PUBLIC_URL}/${file.filename}`,
      }
      const fileSaved = await storageModel.create(fileData)
      fotoId = fileSaved._id
    }

    const { tipoSolucion } = body as { tipoSolucion: 'pendiente' | 'finalizado' }

    if (tipoSolucion === 'pendiente') {
      solicitud.estado = 'pendiente'
    } else if (tipoSolucion === 'finalizado') {
      solicitud.estado = 'finalizado'

      const usuario = await usuarioModel.findById(solicitud.usuario)
      if (usuario) {
        await sendMail({
          from: process.env.EMAIL,
          to: usuario.correo,
          subject: 'Caso Cerrado - Mesa de Servicio - CTPI-CAUCA',
          html: `
            <p>Cordial saludo, ${usuario.nombre},</p>
            <p>Nos permitimos informarle que su caso con código ${solicitud.codigoCaso} ha sido cerrado con éxito.</p>
            <p>Gracias por utilizar nuestro servicio de Mesa de Ayuda. Si tiene alguna otra solicitud, no dude en contactarnos.</p>
            <br>
            <p>Atentamente,</p>
            <p>Equipo de Mesa de Servicio - CTPI-CAUCA</p>`,
        })
      }
    }

    const dataSolucion = {
      ...body,
      solicitud: solicitud._id,
      evidencia: fotoId,
    }

    const solucion = await solucionCasoModel.create(dataSolucion)
    const solicitudActualizada = await solicitudModel.findByIdAndUpdate(
      id,
      { 
        solucion: solucion._id,
        estado: solicitud.estado 
      },
      { new: true, runValidators: false }
    )

    if (!solicitudActualizada) {
      res.status(404).json({ message: 'Error al actualizar la solicitud' })
      return
    }

    // Crear notificación para el usuario
    const mensajeNotif = solicitudActualizada.estado === 'finalizado' 
      ? `Tu solicitud #${solicitudActualizada.codigoCaso} cambió a "Finalizado"`
      : `Tu solicitud #${solicitudActualizada.codigoCaso} cambió a "Pendiente"`;

    await Notificacion.create({
      usuario: solicitudActualizada.usuario,
      mensaje: mensajeNotif,
      tipo: 'estado_ticket',
      ticketId: solicitudActualizada._id,
      leido: false
    })

    io.emit('actualizarSolicitud', {
      solicitudId: solicitudActualizada._id,
      estado: solicitudActualizada.estado,
    })

    const message =
      tipoSolucion === 'finalizado'
        ? 'Caso cerrado exitosamente'
        : 'La solución del caso está pendiente y será resuelto próximamente.'

    res.status(200).send({ message, solucionCaso: solucion })
  } catch (_error) {
    handleHttpError(res, 'Error al registrar la solución del caso')
  }
}


