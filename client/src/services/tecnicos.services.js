import axiosConfig from './axios';

export const getTecnicosPendientes = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.get('/tecnicos/tecnicosPendientes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener técnicos pendientes:", error.response || error);
    throw error;
  }
};

export const aprobarTecnico = async (id) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.put(`/tecnicos/${id}/aprobarTecnico`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al aprobar técnico:", error.response || error);
    throw error;
  }
};

export const denegarTecnico = async (id) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.put(`/tecnicos/${id}/denegarTecnico`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al denegar técnico:", error.response || error);
    throw error;
  }
};

export const getTecnicosAprobados = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.get('/tecnicos/tecnicosAprobados', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener técnicos aprobados:", error.response || error);
    throw error;
  }
};

// Obtener técnicos inactivos
export const getTecnicosInactivos = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.get('/usuarios/inactivos', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener técnicos inactivos:", error.response || error);
    throw error;
  }
};

// Reactivar técnico
export const reactivarTecnico = async (id) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.put(`/usuarios/${id}/reactivar`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al reactivar técnico:", error.response || error);
    throw error;
  }
};


// Obtener técnicos activos
export const getTecnicosActivos = async () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.get('/usuarios/activos', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    // Acceder a 'data' en la respuesta
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener técnicos activos:", error.response || error);
    throw error;
  }
};

// Inactivar técnico
export const inactivarTecnico = async (id) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axiosConfig.put(`/usuarios/${id}/inactivar`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al inactivar técnico:", error.response || error);
    throw error;
  }
};
