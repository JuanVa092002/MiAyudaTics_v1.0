import { Schema, model, Model, Types } from 'mongoose'

export interface IUsuario {
  _id: Types.ObjectId | string
  nombre: string
  correo: string
  rol: 'funcionario' | 'lider' | 'tecnico'
  telefono: string
  password?: string
  activo: boolean
  estado: boolean
  foto?: Types.ObjectId
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  createdAt?: Date
  updatedAt?: Date
}

const usuarioSchema = new Schema<IUsuario>(
  {
    nombre: {
      type: String,
      required: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    rol: {
      type: String,
      enum: ['funcionario', 'lider', 'tecnico'],
      required: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    activo: {
      type: Boolean,
      default: false,
    },
    estado: {
      type: Boolean,
      default: false,
    },
    foto: {
      type: Schema.Types.ObjectId,
      ref: 'Storage',
      required: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

usuarioSchema.pre('save', function (next) {
  if (this.isNew && this.rol === 'tecnico') {
    this.estado = false
  }
  next()
})

const Usuario = model<IUsuario, Model<IUsuario>>('Usuario', usuarioSchema)
export default Usuario

