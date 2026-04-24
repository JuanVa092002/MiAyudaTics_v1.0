import { vi, beforeAll, afterAll } from 'vitest'

import models from '../core/models'

beforeAll(async () => {
  process.env.NODE_ENV = 'test'
  process.env.JWT_SECRET = 'test_secret'
  
  // Mockear todos los modelos globalmente para evitar que busquen conexin a DB
  const mockChain = {
    populate: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue([]),
    then: vi.fn().mockImplementation((resolve) => resolve([])),
  }

  vi.spyOn(models.usuarioModel, 'findById').mockReturnValue({ ...mockChain, exec: vi.fn().mockResolvedValue(null) } as any)
  vi.spyOn(models.usuarioModel, 'findOne').mockReturnValue({ ...mockChain, exec: vi.fn().mockResolvedValue(null) } as any)
  vi.spyOn(models.usuarioModel, 'find').mockReturnValue(mockChain as any)
  vi.spyOn(models.ambienteModel, 'find').mockReturnValue(mockChain as any)
  vi.spyOn(models.solicitudModel, 'find').mockReturnValue(mockChain as any)
  vi.spyOn(models.solicitudModel, 'create').mockResolvedValue({ _id: 'new-id' } as any)
  
  // Esperar a que las rutas dinmicas se carguen

  
  // Silenciar logs de morgan en tests para una salida limpia
  vi.mock('morgan', () => ({
    default: () => (_req: any, _res: any, next: any) => next(),
  }))
})

afterAll(() => {
  vi.clearAllMocks()
})

