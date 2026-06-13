import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { isDefaultAvatar, DEFAULT_AVATAR_FILENAME } from '../shared/constants/media'
import { detectMediaMime } from '../shared/utils/validateMediaBuffer'

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

describe('validateMediaBuffer', () => {
  it('detecta JPEG por magic bytes', () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])
    expect(detectMediaMime(jpeg)).toBe('image/jpeg')
  })

  it('detecta PNG por magic bytes', () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    expect(detectMediaMime(png)).toBe('image/png')
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

  it('rechaza buffer no reconocido', async () => {
    await expect(
      saveUploadedFile(
        { buffer: Buffer.from([0x00, 0x01, 0x02]), mimetype: 'image/png', originalname: 'x.png' },
        'evidencias'
      )
    ).rejects.toThrow(/UNSUPPORTED_MEDIA/)
  })

  it('guarda y elimina archivo local', async () => {
    const file = {
      buffer: Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        ...Buffer.from('qa-test'),
      ]),
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
