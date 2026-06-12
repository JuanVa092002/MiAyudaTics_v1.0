import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

/** Backend sin /api — ej. http://localhost:8000 o https://api.onrender.com */
function resolveApiBaseUrl(): string {
  const raw = (import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_URL) as string | undefined
  if (!raw?.trim()) return ''
  const trimmed = raw.trim().replace(/\/$/, '')
  if (trimmed.endsWith('/api')) return trimmed
  return `${trimmed}/api`
}

const apiBaseUrl = resolveApiBaseUrl()

if (!apiBaseUrl && import.meta.env.DEV) {
  console.warn('[api] Define VITE_BACKEND_URL (local) o VITE_API_URL (producción)')
}

const axiosConfig = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosConfig.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
)

axiosConfig.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      if (error.response) {
        console.error('Error de respuesta:', error.response.data)
      } else if (error.request) {
        console.error('Error de conexión:', error.request)
      } else {
        console.error('Error:', error.message)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosConfig
