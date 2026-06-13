import type {
  ActualizarSolicitudPayload,
  ActualizarTecnicoPayload,
  NotificacionPayload,
} from '@miayuda/contracts'
import { RealtimeEvents } from '@miayuda/contracts'
import { emitToUser } from '../utils/handleSocket'
import type { INotificacion } from '../../features/shared/models/notificaciones'

export { RealtimeEvents }

export function buildSolicitudUpdatePayload(solicitud: {
  _id: unknown
  estado: string
  codigoCaso?: number | string
  updatedAt?: Date
}): ActualizarSolicitudPayload {
  const consecutivo =
    typeof solicitud.codigoCaso === 'number'
      ? solicitud.codigoCaso
      : solicitud.codigoCaso !== undefined
        ? Number(solicitud.codigoCaso)
        : undefined

  return {
    solicitudId: String(solicitud._id),
    estado: solicitud.estado,
    consecutivo: Number.isNaN(consecutivo) ? undefined : consecutivo,
    updatedAt: solicitud.updatedAt?.toISOString() ?? new Date().toISOString(),
  }
}

export function emitSolicitudUpdate(
  userId: string,
  solicitud: Parameters<typeof buildSolicitudUpdatePayload>[0]
): void {
  emitToUser(userId, RealtimeEvents.ACTUALIZAR_SOLICITUD, buildSolicitudUpdatePayload(solicitud))
}

export function emitTecnicoUpdate(userId: string, payload: ActualizarTecnicoPayload): void {
  emitToUser(userId, RealtimeEvents.ACTUALIZAR_TECNICO, payload)
}

export function toNotificacionPayload(doc: INotificacion): NotificacionPayload {
  return {
    _id: String(doc._id),
    mensaje: doc.mensaje,
    tipo: doc.tipo,
    ticketId: String(doc.ticketId),
    leido: doc.leido,
    createdAt: doc.createdAt.toISOString(),
  }
}

export function emitNotificacion(userId: string, doc: INotificacion): void {
  emitToUser(userId, RealtimeEvents.NUEVA_NOTIFICACION, toNotificacionPayload(doc))
}
