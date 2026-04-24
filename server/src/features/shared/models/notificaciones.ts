import { Schema, model, Document } from 'mongoose';

export interface INotificacion extends Document {
  usuario: Schema.Types.ObjectId;
  mensaje: string;
  tipo: 'estado_ticket';
  ticketId: Schema.Types.ObjectId;
  leido: boolean;
  createdAt: Date;
}

const notificacionSchema = new Schema<INotificacion>({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  mensaje: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['estado_ticket'],
    default: 'estado_ticket'
  },
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Solicitud',
    required: true
  },
  leido: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model<INotificacion>('Notificacion', notificacionSchema);

