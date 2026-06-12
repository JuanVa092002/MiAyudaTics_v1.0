import 'dotenv/config'
import express from 'express'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import { app, server } from '../shared/utils/handleSocket'
import router from './routes'
import { healthCheck } from './health'
import { getStorageDir } from '../shared/config/storagePaths'

function parseAllowedOrigins(): string[] {
  const origins = new Set<string>()

  const fromEnv = process.env.CORS_ORIGINS ?? process.env.CORS_ORIGIN ?? ''
  for (const entry of fromEnv.split(',')) {
    const trimmed = entry.trim()
    if (trimmed) origins.add(trimmed)
  }

  const clientUrl = process.env.CLIENT_URL?.trim()
  if (clientUrl) origins.add(clientUrl)

  const legacyOrigin = process.env.LEGACY_RENDER_FRONTEND_URL?.trim()
  if (legacyOrigin) origins.add(legacyOrigin)

  return [...origins]
}

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  app.set('trust proxy', 1)
}

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

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
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
)

app.use(morgan(isProd ? 'combined' : 'dev'))
app.use(express.json())

// Middleware para analizar cuerpos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Configuración de archivos estáticos y motor de plantillas
app.use(express.static(path.join(__dirname, 'public')))
app.use('/media', express.static(path.join(__dirname, 'media')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(getStorageDir()))

app.get('/api/health', healthCheck)
app.use('/api', router)

// Iniciar el servidor se movió a src/index.ts

// Exportar para pruebas
export { app, server }

