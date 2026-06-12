import { DateTime } from 'luxon'
import models from '../../../core/models'

const { consecutivoCasoModel } = models

export const postConsecutivoCaso = async (): Promise<string> => {
  try {
    const currentYearMonth = DateTime.now().toFormat('yyyy-MM')

    const consecutivo = await consecutivoCasoModel.findOneAndUpdate(
      { yearMonth: currentYearMonth },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    const consecutivoFormateado = consecutivo.sequence.toString().padStart(5, '0')
    return `${currentYearMonth}-${consecutivoFormateado}`
  } catch {
    throw new Error('Error al generar el código del caso')
  }
}
