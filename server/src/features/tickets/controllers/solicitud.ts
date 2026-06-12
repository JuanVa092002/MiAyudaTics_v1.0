import { Request, Response } from 'express'
import { handleHttpError } from '../../../shared/utils/handleError'
import { sendMail } from '../../../shared/utils/handleEmail'
import {
  buildSolicitudRegistradaEmail,
  buildCasoAsignadoEmail,
  getEmailFrom,
} from '../../../shared/emails'
import { emitToUser } from '../../../shared/utils/handleSocket'
import { postConsecutivoCaso } from './consecutivoCaso'
import models from '../../../core/models'
import { Types } from 'mongoose'
import Notificacion from '../../shared/models/notificaciones'

const { solicitudModel, storageModel, usuarioModel, ambienteModel } = models
import { saveUploadedFile } from '../../../shared/services/mediaStorage'

export const getSolicitud = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await solicitudModel
      .find({})
      .select('descripcion fecha estado codigoCaso')
      .populate('usuario', 'nombre')
      .populate('ambiente', 'nombre')
      .populate('tecnico', 'nombre')
      .populate('foto', 'url')
      .populate({
        path: 'solucion',
        select: 'descripcionSolucion evidencia',
        populate: { path: 'evidencia', select: 'url' },
      })

    res.status(200).json({ message: 'solicitudes consultadas exitosamente', data })
  } catch (_error) {
    handleHttpError(res, 'error al obtener datos')
  }
}

export const getHistorialSolicitud = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await solicitudModel
      .find({ estado: { $ne: 'solicitado' } })
      .select('descripcion fecha estado codigoCaso')
      .populate('usuario', 'nombre')
      .populate('ambiente', 'nombre')
      .populate('tecnico', 'nombre')
      .populate('foto', 'url')
      .populate({ path: 'solucion', select: 'descripcionSolucion' })

    res.status(200).json({ message: 'Solicitudes consultadas exitosamente', data })
  } catch (_error) {
    handleHttpError(res, 'Error al obtener datos')
  }
}

export const getSolicitudId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const data = await solicitudModel
      .findById(id)
      .select('descripcion fecha estado')
      .populate('usuario', 'nombre')
      .populate('ambiente', 'nombre activo')
      .populate('tecnico', 'nombre')
      .populate('foto', 'url')
      .populate({
        path: 'solucion',
        select: 'descripcionSolucion evidencia',
        populate: { path: 'evidencia', select: 'url' },
      })

    if (!data) {
      handleHttpError(res, 'solicitud no encontrada')
      return
    }
    res.status(200).json({ message: 'solicitud consultada exitosamente', data })
  } catch (_error) {
    handleHttpError(res, 'Error al consultar la solicitud')
  }
}

export const deleteSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const data = await solicitudModel.findByIdAndDelete(id)
    if (!data) {
      handleHttpError(res, 'solicitud no encontrada', 404)
      return
    }
    res.status(200).json({ message: 'Solicitud eliminada exitosamente', data })
  } catch (_error) {
    handleHttpError(res, 'Error al eliminar solicitud')
  }
}

export const getSolicitudesPendientes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await solicitudModel
      .find({ estado: 'solicitado' })
      .select('descripcion fecha estado codigoCaso')
      .populate('usuario', 'nombre')
      .populate('ambiente', 'nombre')
      .populate('foto', 'url')

    res.status(200).json({ message: 'Solicitudes pendientes consultadas', data })
  } catch (_error) {
    handleHttpError(res, 'Error al obtener solicitudes pendientes')
  }
}

export const crearSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.usuario!._id
    const { body } = req
    const file = req.file

    const ambienteActivo = await ambienteModel.findOne({ _id: body.ambiente, activo: true })
    if (!ambienteActivo) {
      handleHttpError(res, 'El ambiente seleccionado no está activo o no existe', 400)
      return
    }

    let fotoId: Types.ObjectId | undefined

    if (file) {
      const fileData = await saveUploadedFile(file, 'evidencias')
      const fileSaved = await storageModel.create(fileData)
      fotoId = fileSaved._id
    }

    const codigoCaso = await postConsecutivoCaso()

    const dataSolicitud = {
      ...body,
      usuario: usuarioId,
      foto: fotoId,
      codigoCaso,
      estado: 'solicitado',
    }

    const solicitudCreada = await solicitudModel.create(dataSolicitud)
    res.status(201).send({ message: 'Registro de solicitud exitoso', solicitud: solicitudCreada })

    const usuario = await usuarioModel.findById(dataSolicitud.usuario)
    if (usuario) {
      const { html, text } = buildSolicitudRegistradaEmail({
        nombre: usuario.nombre,
        codigoCaso,
      })
      await sendMail({
        from: getEmailFrom(),
        to: usuario.correo,
        subject: 'Registro Solicitud — AyudaTIC',
        html,
        text,
      })
    }
  } catch (_error) {
    handleHttpError(res, 'Error al registrar solicitud')
  }
}

export const historialSolicitudesCreadas = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = req.usuario!._id
  const usuario = await usuarioModel.findById(usuarioId)

  try {
    const solicitudesFinalizadas = await solicitudModel
      .find({ usuario: usuarioId })
      .select('descripcion fecha estado codigoCaso')
      .populate('ambiente', 'nombre')
      .populate('tipoCaso', 'nombre')
      .populate('tecnico', 'nombre')
      .populate('foto', 'url')
      .populate({ path: 'solucion', select: 'descripcionSolucion' })

    res.status(200).json({
      message: `Historial Solicitudes finalizadas ${usuario?.nombre ?? ''}`,
      solicitudesFinalizadas,
    })
  } catch (_error) {
    handleHttpError(res, 'error al obtener datos')
  }
}

export const asignarTecnicoSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { tecnico } = req.body

    const solicitud = await solicitudModel.findById(id)
    if (!solicitud) {
      res.status(404).json({ message: 'Solicitud no encontrada' })
      return
    }

    const tecnicoAsignado = await usuarioModel.findOne({ _id: tecnico, rol: 'tecnico', estado: true })
    if (!tecnicoAsignado) {
      res.status(404).json({ message: 'Técnico no encontrado o no aprobado' })
      return
    }

    const solicitudActualizada = await solicitudModel.findByIdAndUpdate(
      id,
      { 
        tecnico, 
        estado: 'asignado' 
      },
      { new: true, runValidators: false }
    )

    if (!solicitudActualizada) {
      res.status(404).json({ message: 'Error al actualizar la solicitud' })
      return
    }

    // Crear notificación para el usuario
    await Notificacion.create({
      usuario: solicitudActualizada.usuario,
      mensaje: `Tu solicitud #${solicitudActualizada.codigoCaso} cambió a "Asignado"`,
      tipo: 'estado_ticket',
      ticketId: solicitudActualizada._id,
      leido: false
    })

    const solicitudPayload = {
      solicitudId: solicitudActualizada._id,
      estado: solicitudActualizada.estado,
    }
    emitToUser(String(solicitudActualizada.usuario), 'actualizarSolicitud', solicitudPayload)
    emitToUser(String(tecnico), 'actualizarSolicitud', solicitudPayload)

    const solicitudesAsignadas = await solicitudModel.countDocuments({
      tecnico,
      estado: 'asignado',
    })

    emitToUser(String(tecnico), 'actualizarTecnico', {
      tecnicoId: tecnico,
      numeroSolicitudesAsignadas: solicitudesAsignadas,
    })

    const { html, text } = buildCasoAsignadoEmail({
      nombre: tecnicoAsignado.nombre,
      codigoCaso: solicitudActualizada.codigoCaso,
    })
    sendMail({
      from: getEmailFrom(),
      to: tecnicoAsignado.correo,
      subject: 'Asignación de caso — AyudaTIC',
      html,
      text,
    })

    res.status(200).json({ message: 'Técnico asignado exitosamente', solicitud })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ message: 'Error al asignar técnico', error: err.message })
  }
}

export const getSolicitudesAsignadas = async (req: Request, res: Response): Promise<void> => {
  try {
    const tecnicoId = req.usuario!._id
    const tecnico = await usuarioModel.findById(tecnicoId)

    const solicitudesAsignadas = await solicitudModel
      .find({ tecnico: tecnicoId, estado: { $ne: 'finalizado' } })
      .select('descripcion telefono fecha estado codigoCaso')
      .populate('usuario', 'nombre')
      .populate('ambiente', 'nombre')
      .populate('foto', 'url')

    // Evita respuestas condicionales 304 sin body para esta consulta de técnico.
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')

    res.status(200).json({
      message: `solicitudes asignadas tecnico ${tecnico?.nombre ?? ''}`,
      solicitudesAsignadas,
    })
  } catch (_error) {
    handleHttpError(res, 'Error al obtener datos')
  }
}

export const getSolicitudesFinalizadas = async (req: Request, res: Response): Promise<void> => {
  try {
    const tecnicoId = req.usuario!._id
    const tecnico = await usuarioModel.findById(tecnicoId)

    const solicitudesFinalizadas = await solicitudModel
      .find({ tecnico: tecnicoId, estado: 'finalizado' })
      .select('descripcion fecha codigoCaso')
      .populate('usuario', 'nombre')
      .populate('ambiente', 'nombre')
      .populate('foto', 'url')
      .populate({
        path: 'solucion',
        select: 'descripcionSolucion evidencia',
        populate: { path: 'evidencia', select: 'url' },
      })

    res.status(200).json({
      message: `Solicitudes finalizadas del técnico ${tecnico?.nombre ?? ''}`,
      solicitudesFinalizadas,
    })
  } catch (_error) {
    handleHttpError(res, 'Error al obtener solicitudes finalizadas')
  }
}


