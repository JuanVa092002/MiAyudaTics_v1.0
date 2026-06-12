import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { app } from '../core/app'
import models from '../core/models'

const protectedRoutes = [
  { method: 'get' as const, path: '/api/solicitud' },
  { method: 'get' as const, path: '/api/usuarios' },
  { method: 'get' as const, path: '/api/storage' },
  { method: 'get' as const, path: '/api/graficaSolicitudesPorMes' },
  { method: 'get' as const, path: '/api/graficaSolicitudesPorAmbiente' },
]

describe('Security contract — rutas protegidas', () => {
  it.each(protectedRoutes)('$method $path devuelve 401 sin token', async ({ method, path }) => {
    const response = await request(app)[method](path)
    expect(response.status).toBe(401)
  })
})

describe('Security contract — registro público', () => {
  it('rechaza rol lider en el validador de registro', async () => {
    const response = await request(app).post('/api/auth/register').send({
      nombre: 'Atacante',
      correo: 'atacante@test.com',
      rol: 'lider',
      telefono: '3001234567',
      password: 'abc123',
    })

    expect(response.status).toBe(422)
  })
})

describe('Security contract — recuperar contraseña', () => {
  it('no revela si el correo existe (respuesta genérica)', async () => {
    vi.spyOn(models.usuarioModel, 'findOne').mockResolvedValueOnce(null)

    const response = await request(app)
      .post('/api/recuperarPassword')
      .send({ correo: 'noexiste@example.com' })

    expect(response.status).toBe(200)
    expect(response.body.message).toContain('Si el correo está registrado')
  })
})
