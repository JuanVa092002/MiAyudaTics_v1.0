import { Schema, model, Model, Types } from 'mongoose'
import { DateTime } from 'luxon'

interface ISolicitud {
  usuario: Types.ObjectId
  ambiente: Types.ObjectId
  tipoCaso: Types.ObjectId
  descripcion: string
  telefono: string
  fecha: Date
  codigoCaso: string
  estado: 'solicitado' | 'asignado' | 'pendiente' | 'finalizado'
  tecnico?: Types.ObjectId
  solucion?: Types.ObjectId
  foto?: Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
}

const solicitudSchema = new Schema<ISolicitud>(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    ambiente: {
      type: Schema.Types.ObjectId,
      ref: 'Ambiente',
      required: true,
    },
    tipoCaso: {
      type: Schema.Types.ObjectId,
      ref: 'TipoCaso',
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    codigoCaso: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ['solicitado', 'asignado', 'pendiente', 'finalizado'],
      required: true,
      default: 'solicitado',
    },
    tecnico: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: false,
    },
    solucion: {
      type: Schema.Types.ObjectId,
      ref: 'SolucionCaso',
      required: false,
    },
    foto: {
      type: Schema.Types.ObjectId,
      ref: 'Storage',
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ;(ret as { fecha?: Date | string }).fecha = DateTime.fromJSDate(ret.fecha)
          .setLocale('es')
          .toFormat('dd-MM-yyyy HH:mm')
        return ret
      },
    },
  }
)

const Solicitud = model<ISolicitud, Model<ISolicitud>>('Solicitud', solicitudSchema)
export default Solicitud

