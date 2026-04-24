import { Request, Response } from 'express'
import { handleHttpError } from '../../../shared/utils/handleError'
import { sendMail } from '../../../shared/utils/handleEmail'
import fs from 'fs'
import path from 'path'
import models from '../../../core/models'
import { Types } from 'mongoose'

const { usuarioModel, storageModel, solicitudModel } = models

/** Shape of a lean tecnico document augmented with solicitudes count */
interface TecnicoConSolicitudes {
  _id: Types.ObjectId
  nombre: string
  correo: string
  telefono: string
  numeroSolicitudesAsignadas?: number
}

export const listaTecnicosPendientes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tecnicosFalse = await usuarioModel
      .find({ rol: 'tecnico', estado: false })
      .select('nombre correo estado telefono')

    if (!tecnicosFalse) {
      res.status(500).send({ message: 'no hay tecnicos pendientes de aprobación' })
      return
    }
    res.status(200).json({ message: 'lista de tecnicos pendientes de aprobacion', tecnicosFalse })
  } catch (_error) {
    handleHttpError(res, 'Error al listar tecnicos pendientes de aprobacion', 500)
  }
}

export const aprobarTecnico = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  try {
    const tecnico = await usuarioModel.findByIdAndUpdate(
      id,
      { estado: true, activo: true },
      { new: true }
    )
    if (!tecnico) {
      res.status(404).send({ message: 'Técnico no encontrado' })
      return
    }

    res.status(200).send({ message: 'Técnico aprobado exitosamente', tecnico })

    sendMail({
      from: process.env.EMAIL,
      to: tecnico.correo,
      subject: 'Aprobación de Registro - Mesa de Servicio - CTPI-CAUCA',
      html: `Cordial saludo, ${tecnico.nombre}.<br><br>
                    Nos complace informarle que su cuenta ha sido aprobada y ahora tiene acceso al sistema de Mesa de Servicio del CTPI-CAUCA.<br><br>
                    Puede ingresar al sistema utilizando el siguiente enlace: <a href="http://mesadeservicioctpicauca.sena.edu.co">Mesa de Servicio CTPI-CAUCA</a>.<br><br>
                    Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.<br><br>
                    Atentamente,<br>Equipo de Mesa de Servicio CTPI-CAUCA`,
    })
  } catch (_error) {
    handleHttpError(res, 'Error al aprobar técnico', 500)
  }
}

export const denegarTecnico = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  try {
    const tecnico = await usuarioModel
      .findById(id)
      .populate<{ foto: { _id: Types.ObjectId; filename: string } | null }>('foto')

    if (!tecnico) {
      res.status(404).send({ message: 'tecnico no encontrado' })
      return
    }

    if (tecnico.foto && tecnico.foto.filename !== 'usuario-undefined.png') {
      await storageModel.findByIdAndDelete(tecnico.foto._id)
      const pathStorage = path.join(__dirname, '../storage', tecnico.foto.filename)
      fs.unlink(pathStorage, err => {
        if (err) {
          console.error('Error al eliminar el archivo físico:', err)
        }
      })
    }

    sendMail({
      from: process.env.EMAIL,
      to: tecnico.correo,
      subject: 'Registro Denegado - Mesa de Servicio - CTPI-CAUCA',
      html: `Cordial saludo, ${tecnico.nombre}.<br><br>
                    Lamentamos informarle que su cuenta no ha sido aprobada, es posible que su registro esté incompleto o
                    no cuente con los permisos para ingresar a: <a href="http://mesadeservicioctpicauca.sena.edu.co">Mesa de Servicio CTPI-CAUCA</a>.<br><br>
                    Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.<br><br>
                    Atentamente,<br>Equipo de Mesa de Servicio CTPI-CAUCA`,
    })

    await usuarioModel.findByIdAndDelete(id)

    res.send({
      message: `tecnico ${id} ha sido denegado, eliminando sus datos de registro y su foto asociada`,
    })
  } catch (_error) {
    handleHttpError(res, 'Error al eliminar el usuario', 500)
  }
}

export const listaTecnicosAprobados = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tecnicos = await usuarioModel
      .find({ rol: 'tecnico', estado: true, activo: true }, 'nombre correo telefono')
      .lean<TecnicoConSolicitudes[]>()

    for (const tecnico of tecnicos) {
      tecnico.numeroSolicitudesAsignadas = await solicitudModel.countDocuments({
        tecnico: tecnico._id,
        estado: 'asignado',
      })
    }

    if (!tecnicos || tecnicos.length === 0) {
      res.status(500).send({ message: 'No hay técnicos aprobados' })
      return
    }

    res.status(200).json({ message: 'Lista de técnicos con registro aprobado', tecnicos })
  } catch (_error) {
    handleHttpError(res, 'Error al listar técnicos con registro aprobado', 500)
  }
}

