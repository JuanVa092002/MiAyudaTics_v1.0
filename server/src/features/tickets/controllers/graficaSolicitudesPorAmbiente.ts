import { Request, Response } from 'express'
import { handleHttpError } from '../../../shared/utils/handleError'
import models from '../../../core/models'

const { solicitudModel } = models

/** Shape of each row returned by the aggregate pipeline */
interface AmbienteAgregado {
  nombre: string
  cantidad: number
  activo: boolean | undefined
}

export const getSolicitudesPorAmbientes = async (req: Request, res: Response): Promise<void> => {
  const year = parseInt(req.query.year as string) || new Date().getFullYear()
  const start = new Date(`${year}-01-01T00:00:00.000Z`)
  const end = new Date(`${year + 1}-01-01T00:00:00.000Z`)

  try {
    const data = await solicitudModel.aggregate<AmbienteAgregado>([
      {
        $match: {
          fecha: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: '$ambiente',
          cantidad: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'ambientes',
          localField: '_id',
          foreignField: '_id',
          as: 'ambiente',
        },
      },
      {
        $unwind: {
          path: '$ambiente',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          nombre: { $ifNull: ['$ambiente.nombre', 'Ambiente Eliminado'] },
          cantidad: '$cantidad',
          activo: '$ambiente.activo',
        },
      },
      {
        $sort: { cantidad: -1 },
      },
    ])

    res.status(200).json({ message: 'Datos obtenidos correctamente', data })
  } catch (_error) {
    handleHttpError(res, 'Error al obtener datos agregados por ambiente')
  }
}

