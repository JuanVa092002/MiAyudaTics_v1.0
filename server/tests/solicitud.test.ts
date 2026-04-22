import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import models from '../models'
import { tokenSign } from '../utils/handleJwt'

// Mocking sendMail to avoid real emails
vi.mock('../utils/handleEmail', () => ({
  sendMail: vi.fn().mockResolvedValue(undefined)
}))

describe('Caso Feliz Crtico - Solicitudes', () => {
  const dummyUser = {
    _id: '60d0fe4f5311236168a109ca',
    rol: 'funcionario',
    nombre: 'Juan Funcionario',
    correo: 'juan@test.com'
  }

  const dummyAmbiente = {
    _id: '60d0fe4f5311236168a109cb',
    nombre: 'Ambiente 101',
    activo: true
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe permitir a un funcionario crear una solicitud exitosamente (Mocked)', async () => {
    // 1. Mockear Auth
    const findByIdSpy = vi.spyOn(models.usuarioModel, 'findById')
    findByIdSpy.mockResolvedValue(dummyUser)

    // 2. Mockear Ambiente Activo
    const findOneAmbienteSpy = vi.spyOn(models.ambienteModel, 'findOne')
    findOneAmbienteSpy.mockResolvedValue(dummyAmbiente)

    // 3. Mockear Creacin de Solicitud y Consecutivo
    const createSolicitudSpy = vi.spyOn(models.solicitudModel, 'create')
    // @ts-expect-error: Mocking specific return type for create method
    createSolicitudSpy.mockResolvedValue({ _id: 'new-sol-id', codigoCaso: 'SOL-001' })

    const findOneConsecutivoSpy = vi.spyOn(models.consecutivoCasoModel, 'findOne')
    findOneConsecutivoSpy.mockResolvedValue({ yearMonth: '2024-04', sequence: 1, save: vi.fn() })

    const findOneStorageSpy = vi.spyOn(models.storageModel, 'findOne')
    findOneStorageSpy.mockResolvedValue({ _id: 'storage-id', filename: 'test.png' })

    // 4. Token
    const token = await tokenSign(dummyUser)

    // 5. Request
    const response = await request(app)
      .post('/api/solicitud')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ambiente: dummyAmbiente._id,
        descripcion: 'Problema con el aire acondicionado del ambiente',
        telefono: '3001234567',
        usuario: dummyUser._id
      })

    expect(response.status).toBe(201)
    expect(response.body.message).toContain('Registro de solicitud exitoso')
    
    // Verificar que se intent enviar correo
    const { sendMail } = await import('../utils/handleEmail')
    expect(sendMail).toHaveBeenCalled()

    findByIdSpy.mockRestore()
    findOneAmbienteSpy.mockRestore()
    createSolicitudSpy.mockRestore()
  })
})
