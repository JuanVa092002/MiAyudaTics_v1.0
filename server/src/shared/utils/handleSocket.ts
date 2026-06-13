import express from 'express'
import http from 'http'
import { Server as SocketIoServer, Socket } from 'socket.io'
import { verifyToken } from './handleJwt'
import { extractAuthToken } from './extractAuthToken'
import { isAccountAllowed } from '../middleware/accountStatus'
import { createCorsOriginValidator, parseAllowedOrigins } from '../config/cors'
import { RealtimeEvents } from '@miayuda/contracts'
import models from '../../core/models'
import { logError } from './logger'

export const app = express()
export const server = http.createServer(app)

const allowedOrigins = parseAllowedOrigins()

export const io = new SocketIoServer(server, {
  cors: {
    origin: createCorsOriginValidator(allowedOrigins),
    credentials: true,
  },
})

let activeSocketConnections = 0

export function getActiveSocketConnections(): number {
  return activeSocketConnections
}

io.use(async (socket, next) => {
  try {
    const token = extractAuthToken({
      authorizationHeader: socket.handshake.headers.authorization,
      cookieHeader: socket.handshake.headers.cookie,
      handshakeAuthToken: socket.handshake.auth?.token,
    })

    if (!token) {
      next(new Error('Unauthorized'))
      return
    }

    const payload = await verifyToken(token)
    if (!payload?._id) {
      next(new Error('Unauthorized'))
      return
    }

    const usuario = await models.usuarioModel.findById(payload._id)
    if (!usuario || !isAccountAllowed(usuario)) {
      next(new Error('Unauthorized'))
      return
    }

    socket.data.userId = payload._id
    next()
  } catch (error) {
    logError('Socket auth error', error)
    next(new Error('Unauthorized'))
  }
})

io.on('connection', (socket: Socket) => {
  const userId = socket.data.userId as string
  socket.join(`user:${userId}`)
  activeSocketConnections += 1

  socket.emit(RealtimeEvents.CONNECTION_ACK, {
    userId,
    serverTime: new Date().toISOString(),
  })

  socket.on('disconnect', () => {
    socket.leave(`user:${userId}`)
    activeSocketConnections = Math.max(0, activeSocketConnections - 1)
  })
})

export function emitToUser(userId: string, event: string, payload: unknown): void {
  io.to(`user:${userId}`).emit(event, payload)
}
