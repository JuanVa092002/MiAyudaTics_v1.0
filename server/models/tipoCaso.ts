import { Schema, model, Model } from 'mongoose'

interface ITipoDeCaso {
  nombre: string
  descripcion: string
  createdAt?: Date
  updatedAt?: Date
}

const tipoDeCasoSchema = new Schema<ITipoDeCaso>(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const TipoDeCaso = model<ITipoDeCaso, Model<ITipoDeCaso>>('TipoDeCaso', tipoDeCasoSchema)
export default TipoDeCaso
