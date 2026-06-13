/**
 * Simula cliente móvil: login Bearer → verify-token → socket ack
 * Uso: BACKEND_URL=... TEST_EMAIL=... TEST_PASSWORD=... pnpm run smoke:mobile-api
 */
import 'dotenv/config'
import { io } from 'socket.io-client'
import { RealtimeEvents } from '@miayuda/contracts'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000'
const API = `${BACKEND_URL.replace(/\/$/, '')}/api`
const TEST_EMAIL = process.env.TEST_EMAIL ?? ''
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? ''

let failed = 0

function pass(msg: string): void {
  console.log(`PASS: ${msg}`)
}

function fail(msg: string): void {
  console.error(`FAIL: ${msg}`)
  failed += 1
}

async function main(): Promise<void> {
  console.log('=== mobile-smoke-client ===')
  console.log(`Backend: ${BACKEND_URL}`)

  const healthRes = await fetch(`${API}/health`)
  if (!healthRes.ok) {
    fail(`health ${healthRes.status}`)
  } else {
    const health = (await healthRes.json()) as { integrations?: { socket?: { connections: number } } }
    if (health.integrations?.socket) {
      pass('health integrations.socket presente')
    } else {
      fail('health sin integrations.socket')
    }
  }

  if (!TEST_EMAIL || !TEST_PASSWORD) {
    console.log('SKIP: login/socket (TEST_EMAIL y TEST_PASSWORD no configurados)')
    process.exit(failed > 0 ? 1 : 0)
  }

  const loginRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: TEST_EMAIL, password: TEST_PASSWORD }),
  })

  if (!loginRes.ok) {
    fail(`login ${loginRes.status}`)
    process.exit(1)
  }

  const loginBody = (await loginRes.json()) as {
    dataUser?: { token?: string; expiresIn?: number }
  }
  const token = loginBody.dataUser?.token
  if (!token) {
    fail('login sin token')
    process.exit(1)
  }
  pass('login Bearer token')

  if (loginBody.dataUser?.expiresIn === 7200) {
    pass('login expiresIn 7200')
  } else {
    fail('login sin expiresIn esperado')
  }

  const verifyRes = await fetch(`${API}/auth/verify-token`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (verifyRes.ok) {
    pass('verify-token Bearer')
  } else {
    fail(`verify-token ${verifyRes.status}`)
  }

  await new Promise<void>((resolve, reject) => {
    const socket = io(BACKEND_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: false,
      timeout: 5000,
    })

    const timer = setTimeout(() => {
      socket.disconnect()
      reject(new Error('socket ack timeout'))
    }, 5000)

    socket.on(RealtimeEvents.CONNECTION_ACK, () => {
      clearTimeout(timer)
      pass('socket connection:ack')
      socket.disconnect()
      resolve()
    })

    socket.on('connect_error', (err: Error) => {
      clearTimeout(timer)
      reject(err)
    })
  }).catch(err => {
    fail(`socket: ${err instanceof Error ? err.message : String(err)}`)
  })

  console.log(`=== ${failed === 0 ? 'ALL PASS' : `${failed} FAIL`} ===`)
  process.exit(failed > 0 ? 1 : 0)
}

void main()
