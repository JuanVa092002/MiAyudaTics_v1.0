import { describe, it, expect } from 'vitest'
import { isDefaultAvatar, DEFAULT_AVATAR_FILENAME } from '../shared/constants/media'

describe('media constants', () => {
  it('detecta avatar por defecto', () => {
    expect(isDefaultAvatar(DEFAULT_AVATAR_FILENAME)).toBe(true)
    expect(isDefaultAvatar('miayudatics/defaults/usuario-undefined')).toBe(true)
    expect(isDefaultAvatar('file-123.jpg')).toBe(false)
  })
})
