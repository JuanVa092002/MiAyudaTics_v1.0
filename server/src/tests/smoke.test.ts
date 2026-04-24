import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../core/app'

describe('Smoke Tests - App Connectivity', () => {
  it('debe responder 404 para una ruta inexistente', async () => {
    const response = await request(app).get('/api/ruta-que-no-existe')
    expect(response.status).toBe(404)
  })

  it('el servidor debe estar arriba y responder en el prefijo /api', async () => {
    const response = await request(app).get('/api/usuarios')
    expect(response.status).not.toBe(500)
  })
})

describe('Zod Guardrails - Input Validation', () => {
  it('POST /api/auth/login con body vaco debe retornar 422 (Zod)', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({})
    
    expect(response.status).toBe(422)
    expect(response.body).toHaveProperty('errors')
  })

  it('POST /api/auth/register con datos invlidos debe retornar 422', async () => {
    // Usamos register porque es pblica (no pide token)
    const response = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'J' }) // Nombre muy corto y faltan campos
    
    expect(response.status).toBe(422)
  })
})

