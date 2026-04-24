import { Request, Response } from 'express'
import { handleHttpError } from '../../../shared/utils/handleError'
import models from '../../../core/models'

const { solicitudModel } = models

/** Shape of each row returned by the aggregate pipeline */
interface MesAgregado {
  _id: number        // month number 1–12
  cantidad: number
}

export const getSolicitudesPorMes = async (req: Request, res: Response): Promise<void> => {
  const year = parseInt(req.query.year as string) || new Date().getFullYear()
  const start = new Date(`${year}-01-01T00:00:00.000Z`)
  const end = new Date(`${year + 1}-01-01T00:00:00.000Z`)

  try {
    const data = await solicitudModel.aggregate<MesAgregado>([
      {
        $match: {
          fecha: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: { $month: '$fecha' },
          cantidad: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    const totalSolicitudes = await solicitudModel.countDocuments({
      fecha: { $gte: start, $lt: end },
    })

    res.status(200).json({
      message: 'Datos obtenidos correctamente',
      data,
      totalSolicitudes,
    })
  } catch (_error) {
    handleHttpError(res, 'Error al obtener datos agregados por mes')
  }
}

