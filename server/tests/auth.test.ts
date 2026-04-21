import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import models from '../models'
import { tokenSign } from '../utils/handleJwt'

describe('Auth & RBAC Logic', () => {
  it('debe retornar 401 si no hay token en una ruta protegida', async () => {
    const response = await request(app).get('/api/usuarios/perfil')
    expect(response.status).toBe(401)
    expect(response.body.error).toContain('error en inicio de sesion')
  })

  it('debe retornar 403 si un "funcionario" intenta acceder a ruta de "lider"', async () => {
    // 1. Mockear que el usuario existe en la DB
    const dummyUser = {
      _id: '60d0fe4f5311236168a109ca',
      rol: 'funcionario',
      nombre: 'Test User'
    }
    
    // Spying on the model method
    const findByIdSpy = vi.spyOn(models.usuarioModel, 'findById')
    // @ts-ignore - simplificando el mock para el test
    findByIdSpy.mockResolvedValue(dummyUser)

    // 2. Generar token para funcionario
    const token = await tokenSign(dummyUser)

    // 3. Intentar acceder a /api/tecnicos/tecnicosPendientes (que requiere lider)
    const response = await request(app)
      .get('/api/tecnicos/tecnicosPendientes')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(403)
    findByIdSpy.mockRestore()
  })

  it('debe retornar 401 si el token es invlido o mal formado', async () => {
    const response = await request(app)
      .get('/api/usuarios/perfil')
      .set('Authorization', 'Bearer token-invlido')
    
    expect(response.status).toBe(401)
  })
})
