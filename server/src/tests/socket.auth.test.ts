import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { io as ioClient, type Socket } from 'socket.io-client'
import type { AddressInfo } from 'node:net'
import { server } from '../core/app'
import models from '../core/models'
import { tokenSign } from '../shared/utils/handleJwt'
import { RealtimeEvents } from '@miayuda/contracts'

describe('Socket.IO auth', () => {
  let client: Socket
  const userId = '60d0fe4f5311236168a109ca'

  beforeAll(async () => {
    await new Promise<void>((resolve, reject) => {
      if (server.listening) {
        resolve()
        return
      }
      server.listen(0, () => resolve())
      server.on('error', reject)
    })
  })

  afterAll(async () => {
    client?.disconnect()
    await new Promise<void>(resolve => {
      if (!server.listening) {
        resolve()
        return
      }
      server.close(() => resolve())
    })
  })

  it('rechaza conexión sin token', async () => {
    const port = (server.address() as AddressInfo).port
    const socket = ioClient(`http://127.0.0.1:${port}`, {
      transports: ['websocket'],
      reconnection: false,
    })

    const result = await new Promise<string>((resolve, reject) => {
      socket.on('connect', () => reject(new Error('should not connect')))
      socket.on('connect_error', () => resolve('rejected'))
      setTimeout(() => reject(new Error('timeout')), 2000)
    })

    expect(result).toBe('rejected')
    socket.disconnect()
  })

  it('conecta con auth.token y emite connection:ack', async () => {
    const dummyUser = {
      _id: userId,
      rol: 'funcionario',
      activo: true,
      estado: true,
    }

    vi.spyOn(models.usuarioModel, 'findById').mockResolvedValue(dummyUser as never)
    const token = await tokenSign(dummyUser)
    const port = (server.address() as AddressInfo).port

    client = ioClient(`http://127.0.0.1:${port}`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: false,
    })

    const ack = await new Promise<{ userId: string; serverTime: string }>((resolve, reject) => {
      client.on(RealtimeEvents.CONNECTION_ACK, resolve)
      client.on('connect_error', reject)
      setTimeout(() => reject(new Error('timeout waiting ack')), 3000)
    })

    expect(ack.userId).toBe(userId)
    expect(ack.serverTime).toBeTruthy()
  })

  it('rechaza usuario inactivo', async () => {
    const inactiveUser = {
      _id: '60d0fe4f5311236168a109cb',
      rol: 'funcionario',
      activo: false,
      estado: true,
    }

    vi.spyOn(models.usuarioModel, 'findById').mockResolvedValue(inactiveUser as never)
    const token = await tokenSign(inactiveUser)
    const port = (server.address() as AddressInfo).port

    const socket = ioClient(`http://127.0.0.1:${port}`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: false,
    })

    const result = await new Promise<string>((resolve, reject) => {
      socket.on('connect', () => reject(new Error('should not connect')))
      socket.on('connect_error', () => resolve('rejected'))
      setTimeout(() => reject(new Error('timeout')), 2000)
    })

    expect(result).toBe('rejected')
    socket.disconnect()
  })
})
