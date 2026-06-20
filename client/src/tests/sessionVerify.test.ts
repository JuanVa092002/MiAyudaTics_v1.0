import { describe, expect, it } from 'vitest'
import { SESSION_VERIFY_TIMEOUT_MS } from '@/shared/api/sessionVerify'

describe('SESSION_VERIFY_TIMEOUT_MS', () => {
  it('es 10 segundos para no bloquear la UI durante cold start', () => {
    expect(SESSION_VERIFY_TIMEOUT_MS).toBe(10_000)
  })
})
