import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { app } from '../core/app'
import models from '../core/models'

describe('Logic Mocks - Auth & Password', () => {
  it('POST /api/auth/login debe retornar 401 si el usuario no existe', async () => {
    const findOneSpy = vi.spyOn(models.usuarioModel, 'findOne')
    findOneSpy.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue(null),
    } as never)

    const response = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'noexiste@gmail.com', password: 'password123' })

    expect(response.status).toBe(401)
    expect(response.body.message ?? response.body.error).toContain('credenciales inválidas')
    findOneSpy.mockRestore()
  })

  it('POST /api/restablecerPassword con token invlido debe retornar 400', async () => {
    // El controlador resetPassword busca un usuario con el token
    const findOneSpy = vi.spyOn(models.usuarioModel, 'findOne')
    findOneSpy.mockResolvedValue(null) // Usuario no encontrado con ese token

    const response = await request(app)
      .post('/api/restablecerPassword/token-falso')
      .send({ password: 'newPassword123', confirmPassword: 'newPassword123' })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toContain('Token inv') // Ms seguro que con acentos
    findOneSpy.mockRestore()
  })
})

