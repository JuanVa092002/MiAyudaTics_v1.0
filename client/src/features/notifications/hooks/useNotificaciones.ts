import { useState, useEffect, useCallback } from 'react'
import {
  getNotificaciones,
  marcarComoLeida as serviceMarcarLeida,
  marcarTodasComoLeidas as serviceMarcarTodas,
} from '@/features/notifications/api/notifications.service'
import type { Notificacion } from '@/shared/types'

interface UseNotificacionesResult {
  notificaciones: Notificacion[]
  noLeidas: number
  marcarLeida: (id: string) => Promise<void>
  marcarTodas: () => Promise<void>
  refresh: () => Promise<void>
}

export function useNotificaciones(enabled: boolean): UseNotificacionesResult {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [noLeidas, setNoLeidas] = useState(0)

  const fetchNotificaciones = useCallback(async (): Promise<void> => {
    if (!enabled) return
    try {
      const response = await getNotificaciones()
      setNotificaciones(response.data)
      setNoLeidas(response.data.length)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error al cargar notificaciones', error)
      }
    }
  }, [enabled])

  useEffect(() => {
    void fetchNotificaciones()
    const interval = setInterval(() => {
      void fetchNotificaciones()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchNotificaciones])

  const marcarLeida = async (id: string): Promise<void> => {
    try {
      await serviceMarcarLeida(id)
      setNotificaciones(prev => prev.filter(n => n._id !== id))
      setNoLeidas(prev => Math.max(0, prev - 1))
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error al marcar como leída', error)
      }
    }
  }

  const marcarTodas = async (): Promise<void> => {
    try {
      await serviceMarcarTodas()
      setNotificaciones([])
      setNoLeidas(0)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error al marcar todas como leídas', error)
      }
    }
  }

  return {
    notificaciones,
    noLeidas,
    marcarLeida,
    marcarTodas,
    refresh: fetchNotificaciones,
  }
}
