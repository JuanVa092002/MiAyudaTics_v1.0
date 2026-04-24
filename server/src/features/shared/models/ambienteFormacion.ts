import { Schema, model, Model } from 'mongoose'

interface IAmbiente {
  nombre: string
  activo: boolean
  createdAt?: Date
  updatedAt?: Date
}

const ambienteSchema = new Schema<IAmbiente>(
  {
    nombre: {
      type: String,
      required: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Ambiente = model<IAmbiente, Model<IAmbiente>>('Ambiente', ambienteSchema)
export default Ambiente

