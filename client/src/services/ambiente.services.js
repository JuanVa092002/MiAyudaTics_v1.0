import axiosConfig from './axios';

export const getAmbientes = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.get('/ambienteFormacion', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener ambientes de formación:', error.response || error);
    throw error;
  }
};

export const createAmbiente = async (ambiente) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.post('/ambienteFormacion', ambiente, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el ambiente de formación:', error.response || error);
    throw error;
  }
};

export const updateAmbiente = async (id, ambiente) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.put(`/ambienteFormacion/${id}`, ambiente, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el ambiente de formación:', error.response || error);
    throw error;
  }
};

export const inactivarAmbiente = async (id) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.put(`/ambienteFormacion/${id}/inactivar`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al inactivar el ambiente de formación:', error.response || error);
    throw error;
  }
};