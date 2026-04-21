import express from 'express'
import http from 'http'
import { Server as SocketIoServer, Socket } from 'socket.io'

// Aquí se crea la app de Express
export const app = express()

// Crea el servidor HTTP a partir de la app de Express
export const server = http.createServer(app)

// Inicializa socket.io en el servidor
export const io = new SocketIoServer(server)

// Configuración de Socket.IO
io.on('connection', (socket: Socket) => {
  console.log('Nuevo cliente conectado:', socket.id)

  // Escuchar un evento personalizado desde el cliente
  socket.on('eventoPersonalizado', (data: any) => {
    console.log('Datos recibidos del cliente:', data)

    // Enviar respuesta al cliente
    io.emit('respuestaServidor', { message: 'Respuesta del servidor', data })
  })

  // Detectar desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id)
  })
})
