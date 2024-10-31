import axios from "axios";

const UrlApi = import.meta.env.VITE_BACKEND_URL;

const axiosConfig = axios.create({
  baseURL: `${UrlApi}/api`, // Añadimos /api al baseURL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para las peticiones
axiosConfig.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage si lo usas
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para las respuestas
axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Error de respuesta del servidor
      console.error('Error de respuesta:', error.response.data);
    } else if (error.request) {
      // Error de no respuesta
      console.error('Error de conexión:', error.request);
    } else {
      // Error en la configuración
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;