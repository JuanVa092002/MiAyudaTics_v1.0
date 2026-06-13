export const RealtimeEvents = {
  CONNECTION_ACK: 'connection:ack',
  ACTUALIZAR_SOLICITUD: 'actualizarSolicitud',
  ACTUALIZAR_TECNICO: 'actualizarTecnico',
  NUEVA_NOTIFICACION: 'nuevaNotificacion',
} as const

export type RealtimeEventName = (typeof RealtimeEvents)[keyof typeof RealtimeEvents]

export interface ConnectionAckPayload {
  userId: string
  serverTime: string
}

export interface ActualizarSolicitudPayload {
  solicitudId: string
  estado: string
  consecutivo?: number
  updatedAt?: string
}

export interface ActualizarTecnicoPayload {
  tecnicoId: string
  numeroSolicitudesAsignadas: number
}

export interface NotificacionPayload {
  _id: string
  mensaje: string
  tipo: 'estado_ticket'
  ticketId: string
  leido: boolean
  createdAt: string
}

export interface SocketEventMap {
  [RealtimeEvents.CONNECTION_ACK]: ConnectionAckPayload
  [RealtimeEvents.ACTUALIZAR_SOLICITUD]: ActualizarSolicitudPayload
  [RealtimeEvents.ACTUALIZAR_TECNICO]: ActualizarTecnicoPayload
  [RealtimeEvents.NUEVA_NOTIFICACION]: NotificacionPayload
}
