import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import request from 'supertest'
import { app } from '../core/app'
import models from '../core/models'
import { tokenSign } from '../shared/utils/handleJwt'

const storageDir = path.join(process.cwd(), 'storage-media-access-test')
const testFilename = 'media-access-test.png'

vi.mock('../shared/config/storagePaths', async importOriginal => {
  const actual = await importOriginal<typeof import('../shared/config/storagePaths')>()
  return {
    ...actual,
    getStorageDir: () => storageDir,
  }
})

describe('Media access — no public static storage', () => {
  beforeEach(() => {
    fs.mkdirSync(storageDir, { recursive: true })
    const png = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      ...Buffer.from('test'),
    ])
    fs.writeFileSync(path.join(storageDir, testFilename), png)
  })

  afterEach(() => {
    fs.rmSync(storageDir, { recursive: true, force: true })
  })

  it('GET /api/media/local/:filename sin token devuelve 401', async () => {
    const response = await request(app).get(`/api/media/local/${testFilename}`)
    expect(response.status).toBe(401)
  })

  it('GET /:filename en raíz (antiguo static) devuelve 404', async () => {
    const response = await request(app).get(`/${testFilename}`)
    expect(response.status).toBe(404)
  })

  it('GET /api/media/local/:filename con token devuelve 200', async () => {
    const dummyUser = {
      _id: '60d0fe4f5311236168a109ca',
      rol: 'funcionario',
      nombre: 'Test User',
      activo: true,
      estado: true,
    }

    const findByIdSpy = vi.spyOn(models.usuarioModel, 'findById')
    findByIdSpy.mockResolvedValue(dummyUser as never)

    const token = await tokenSign(dummyUser)
    const response = await request(app)
      .get(`/api/media/local/${testFilename}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    findByIdSpy.mockRestore()
  })

  it('rechaza path traversal en filename', async () => {
    const dummyUser = {
      _id: '60d0fe4f5311236168a109ca',
      rol: 'funcionario',
      activo: true,
      estado: true,
    }
    const findByIdSpy = vi.spyOn(models.usuarioModel, 'findById')
    findByIdSpy.mockResolvedValue(dummyUser as never)
    const token = await tokenSign(dummyUser)

    const response = await request(app)
      .get('/api/media/local/..%2F..%2Fetc%2Fpasswd')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(400)
    findByIdSpy.mockRestore()
  })
})
