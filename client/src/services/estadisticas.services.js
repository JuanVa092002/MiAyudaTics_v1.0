import axios from "./axios";

export const getSolicitudesPorAmbiente = async (year) => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axios.get(`/graficaSolicitudesPorAmbiente?year=${year}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    return response.data;
  } catch (error) {
    console.error("Error fetching solicitudes por ambiente:", error);
  }
};

export const getSolicitudesPorMes = async (year) => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  try {
    const response = await axios.get(`/graficaSolicitudesPorMes?year=${year}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    return response.data;
  } catch (error) {
    console.error("Error fetching solicitudes por mes:", error);
  }
};
