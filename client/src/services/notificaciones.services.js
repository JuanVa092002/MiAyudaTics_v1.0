import axios from './axios';

export const getNotificaciones = () => {
  return axios.get('/notificaciones');
};

export const marcarComoLeida = (id) => {
  return axios.patch(`/notificaciones/${id}/leer`);
};

export const marcarTodasComoLeidas = () => {
  return axios.patch('/notificaciones/leer-todas');
};
