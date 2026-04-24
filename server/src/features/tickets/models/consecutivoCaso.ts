import { Schema, model, Model } from 'mongoose'

interface IConsecutivo {
  yearMonth: string
  sequence: number
  createdAt?: Date
  updatedAt?: Date
}

const consecutivoCasoSchema = new Schema<IConsecutivo>(
  {
    yearMonth: {
      type: String,
      required: true,
      unique: true,
    },
    sequence: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
)

const Consecutivo = model<IConsecutivo, Model<IConsecutivo>>('Consecutivo', consecutivoCasoSchema)
export default Consecutivo

