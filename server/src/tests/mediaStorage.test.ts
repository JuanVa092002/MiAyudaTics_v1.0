import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { isDefaultAvatar, DEFAULT_AVATAR_FILENAME } from '../shared/constants/media'

const storageDir = path.join(process.cwd(), 'storage-qa-test')

vi.mock('../shared/config/cloudinary', () => ({
  isCloudinaryEnabled: vi.fn(() => false),
  ensureCloudinaryConfig: vi.fn(),
  getCloudinaryFolder: vi.fn(() => 'miayudatics'),
  cloudinary: {
    uploader: { destroy: vi.fn(), upload_stream: vi.fn() },
    url: vi.fn(),
  },
}))

vi.mock('../shared/config/storagePaths', () => ({
  getStorageDir: () => storageDir,
  getPublicFileUrl: (filename: string) => `http://localhost:8000/${filename}`,
}))

import { saveUploadedFile, deleteStoredMedia } from '../shared/services/mediaStorage'

describe('media constants', () => {
  it('detecta avatar por defecto', () => {
    expect(isDefaultAvatar(DEFAULT_AVATAR_FILENAME)).toBe(true)
    expect(isDefaultAvatar('miayudatics/defaults/usuario-undefined')).toBe(true)
    expect(isDefaultAvatar('file-123.jpg')).toBe(false)
  })
})

describe('mediaStorage local', () => {
  beforeEach(() => {
    fs.mkdirSync(storageDir, { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(storageDir, { recursive: true, force: true })
  })

  it('rechaza archivo vacío', async () => {
    await expect(
      saveUploadedFile({ buffer: Buffer.alloc(0), mimetype: 'image/png', originalname: 'x.png' }, 'evidencias')
    ).rejects.toThrow(/vacío/)
  })

  it('guarda y elimina archivo local', async () => {
    const file = {
      buffer: Buffer.from('qa-test'),
      mimetype: 'image/png',
      originalname: 'evidencia.png',
    }
    const saved = await saveUploadedFile(file, 'evidencias')
    expect(saved.filename).toMatch(/^file-/)
    expect(saved.url).toContain(saved.filename)
    expect(fs.existsSync(path.join(storageDir, saved.filename))).toBe(true)

    await deleteStoredMedia(saved)
    expect(fs.existsSync(path.join(storageDir, saved.filename))).toBe(false)
  })
})
