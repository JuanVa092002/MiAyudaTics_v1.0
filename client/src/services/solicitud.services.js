import axiosConfig from './axios';

export const crearSolicitud = async (formData) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.post('/solicitud', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    throw error;
  }
};

export const obtenerAmbientes = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.get('/ambienteFormacion', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los ambientes:', error);
    throw error;
  }
};

export const asignarSolicitudTecnico = async (solicitudId, tecnicoId) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.put(`/solicitud/${solicitudId}/asignarTecnico`, tecnicoId, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al asignar la solicitud al técnico:', error);
    throw error;
  }
};

export const HistorialSolicitudesFuncionario = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.get('/solicitud/historial', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.solicitudesFinalizadas;
  } catch (error) {
    console.error('Error al obtener el historial de solicitudes:', error);
    throw error;
  }
};

export const HistorialSolicitudesLider = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.get('/solicitud/historialSolicitudes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.data; // Los datos están en la propiedad `data`
  } catch (error) {
    console.error('Error al obtener el historial de solicitudes:', error);
    throw error;
  }
};