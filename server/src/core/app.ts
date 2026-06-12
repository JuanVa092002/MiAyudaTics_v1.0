import 'dotenv/config'
import express from 'express'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { app, server } from '../shared/utils/handleSocket'
import router from './routes'

function parseAllowedOrigins(): string[] {
  const origins = new Set<string>()

  const fromEnv = process.env.CORS_ORIGINS ?? process.env.CORS_ORIGIN ?? ''
  for (const entry of fromEnv.split(',')) {
    const trimmed = entry.trim()
    if (trimmed) origins.add(trimmed)
  }

  const clientUrl = process.env.CLIENT_URL?.trim()
  if (clientUrl) origins.add(clientUrl)

  // Compatibilidad con despliegues previos en Render (frontend estático)
  origins.add('https://frontend-miayudatics-v1-0-1.onrender.com')

  return [...origins]
}

const allowedProdOrigins = parseAllowedOrigins()

const isLocalDevOrigin = (origin: string): boolean =>
  /^http:\/\/localhost:\d+$/.test(origin) ||
  /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      if (
        process.env.NODE_ENV !== 'production' &&
        isLocalDevOrigin(origin)
      ) {
        return callback(null, true)
      }

      if (allowedProdOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
)

app.use(morgan('dev'))
app.use(express.json())

// Middleware para analizar cuerpos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Configuración de archivos estáticos y motor de plantillas
app.use(express.static(path.join(__dirname, 'public')))
app.use('/media', express.static(path.join(__dirname, 'media')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Los recursos públicos salen de la carpeta storage
app.use(express.static('storage'))

// Invoca las rutas de la API
app.use('/api', router)

// Iniciar el servidor se movió a src/index.ts

// Exportar para pruebas
export { app, server }

