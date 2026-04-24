import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '@/app/providers/Auth.context';
import { 
  getNotificaciones, 
  marcarComoLeida as serviceMarcarLeida, 
  marcarTodasComoLeidas as serviceMarcarTodas 
} from '@/services/notificaciones.services';

export const useNotificaciones = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);

  const fetchNotificaciones = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await getNotificaciones();
      setNotificaciones(response.data);
      setNoLeidas(response.data.length);
    } catch (error) {
      console.error('Error al cargar notificaciones', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotificaciones();
    
    // Polling cada 30 segundos
    const interval = setInterval(fetchNotificaciones, 30000);
    
    return () => clearInterval(interval);
  }, [fetchNotificaciones]);

  const marcarLeida = async (id) => {
    try {
      await serviceMarcarLeida(id);
      setNotificaciones(prev => prev.filter(n => n._id !== id));
      setNoLeidas(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar como leída', error);
    }
  };

  const marcarTodas = async () => {
    try {
      await serviceMarcarTodas();
      setNotificaciones([]);
      setNoLeidas(0);
    } catch (error) {
      console.error('Error al marcar todas como leídas', error);
    }
  };

  return {
    notificaciones,
    noLeidas,
    marcarLeida,
    marcarTodas,
    refresh: fetchNotificaciones
  };
};
