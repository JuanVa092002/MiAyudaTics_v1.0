import 'dotenv/config'
import express from 'express'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { app, server } from './utils/handleSocket'
import { dbConnect } from './config/mongo'
import router from './routes/index'

// Configuración de Express en la app
app.use(
  cors({
    origin: ['https://frontend-miayudatics-v1-0-1.onrender.com/'],
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

const port = process.env.PORT || 8000

// Escucha en el puerto usando server.listen
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})

// Conecta a la base de datos
dbConnect()
