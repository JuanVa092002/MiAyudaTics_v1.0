import { Schema, model, Model, Types } from 'mongoose'

interface ISolucionCaso {
  solicitud: Types.ObjectId
  descripcionSolucion: string
  tipoCaso: Types.ObjectId
  tipoSolucion: 'pendiente' | 'finalizado'
  evidencia?: Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
}

const solucionCasoSchema = new Schema<ISolucionCaso>(
  {
    solicitud: {
      type: Schema.Types.ObjectId,
      ref: 'Solicitud',
      required: true,
    },
    descripcionSolucion: {
      type: String,
      required: true,
    },
    tipoCaso: {
      type: Schema.Types.ObjectId,
      ref: 'TipoDeCaso',
      required: true,
    },
    tipoSolucion: {
      type: String,
      enum: ['pendiente', 'finalizado'],
      required: true,
    },
    evidencia: {
      type: Schema.Types.ObjectId,
      ref: 'Storage',
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

const SolucionCaso = model<ISolucionCaso, Model<ISolucionCaso>>('SolucionCaso', solucionCasoSchema)
export default SolucionCaso

