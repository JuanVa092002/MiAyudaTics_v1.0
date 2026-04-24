import { DateTime } from 'luxon'
import models from '../../../core/models'

const { consecutivoCasoModel } = models

export const postConsecutivoCaso = async (): Promise<string> => {
  try {
    const currentYearMonth = DateTime.now().toFormat('yyyy-MM')

    let consecutivo = await consecutivoCasoModel.findOne({ yearMonth: currentYearMonth })

    if (!consecutivo) {
      consecutivo = new consecutivoCasoModel({
        yearMonth: currentYearMonth,
        sequence: 0,
      })
    }

    consecutivo.sequence += 1
    await consecutivo.save()

    const consecutivoFormateado = consecutivo.sequence.toString().padStart(5, '0')
    return `${currentYearMonth}-${consecutivoFormateado}`
  } catch (_error) {
    throw new Error('Error al generar el código del caso')
  }
}

