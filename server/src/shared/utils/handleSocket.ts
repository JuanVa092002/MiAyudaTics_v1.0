import express from 'express'
import http from 'http'
import { Server as SocketIoServer, Socket } from 'socket.io'
import { verifyToken } from './handleJwt'

export const app = express()
export const server = http.createServer(app)

export const io = new SocketIoServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
})

function parseTokenFromCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.split(';').find(part => part.trim().startsWith('token='))
  if (!match) return null
  return decodeURIComponent(match.trim().slice('token='.length))
}

io.use(async (socket, next) => {
  const token = parseTokenFromCookie(socket.handshake.headers.cookie)
  if (!token) {
    next(new Error('Unauthorized'))
    return
  }

  const payload = await verifyToken(token)
  if (!payload?._id) {
    next(new Error('Unauthorized'))
    return
  }

  socket.data.userId = payload._id
  next()
})

io.on('connection', (socket: Socket) => {
  const userId = socket.data.userId as string
  socket.join(`user:${userId}`)

  socket.on('disconnect', () => {
    socket.leave(`user:${userId}`)
  })
})

export function emitToUser(userId: string, event: string, payload: unknown): void {
  io.to(`user:${userId}`).emit(event, payload)
}
