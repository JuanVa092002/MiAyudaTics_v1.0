import axiosConfig from './axios';

export const getCasos = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try{
    const response = await axiosConfig.get('/tipoCaso', {
      headers:{
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data;
  }catch (error) {
    console.error('Error al obtener tipos de casos:', error.response || error);
    throw error;
  }
};

export const createCaso = async (ambiente) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.post('/tipoCaso', ambiente, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear tipo de caso:', error.response || error);
    throw error;
  }
};

export const updateCaso = async (id, ambiente) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.put(`/tipoCaso/${id}`, ambiente, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el tipo de caso:', error.response || error);
    throw error;
  }
};
