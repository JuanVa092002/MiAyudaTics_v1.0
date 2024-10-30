import axiosConfig from './axios';

export const getSolicitudesPendientes = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.get('/solicitud/pendientes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener solicitudes pendientes:", error.response || error);
    throw error;
  }
};
