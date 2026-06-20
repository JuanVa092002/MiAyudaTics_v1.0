import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { verifyToken } from '@/features/auth/api/auth.service'
import apiClient from '@/shared/api/axios'
import { SESSION_VERIFY_TIMEOUT_MS } from '@/shared/api/sessionVerify'

vi.mock('@/shared/api/axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

function createAbortError(): DOMException {
  return new DOMException('The operation was aborted.', 'AbortError')
}

function rejectWhenAborted(signal: AbortSignal, reject: (reason?: unknown) => void): void {
  if (signal.aborted) {
    reject(createAbortError())
    return
  }

  signal.addEventListener(
    'abort',
    () => {
      reject(createAbortError())
    },
    { once: true }
  )
}

describe('verifyToken', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('aborta la petición tras SESSION_VERIFY_TIMEOUT_MS', async () => {
    let capturedSignal: AbortSignal | undefined

    vi.mocked(apiClient.get).mockImplementation((_url, config) => {
      const signal = config?.signal
      if (!(signal instanceof AbortSignal)) {
        return Promise.reject(new Error('missing abort signal'))
      }

      capturedSignal = signal

      return new Promise((_resolve, reject) => {
        rejectWhenAborted(signal, reject)
      })
    })

    const promise = verifyToken()
    const rejected = expect(promise).rejects.toBeDefined()
    await vi.advanceTimersByTimeAsync(SESSION_VERIFY_TIMEOUT_MS)
    await rejected
    expect(capturedSignal).toBeInstanceOf(AbortSignal)
    expect(capturedSignal?.aborted).toBe(true)
    expect(apiClient.get).toHaveBeenCalledWith(
      'auth/verify-token',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )
  })

  it('devuelve el usuario cuando la API responde a tiempo', async () => {
    const user = { _id: '1', correo: 'a@test.com', rol: 'funcionario' }
    vi.mocked(apiClient.get).mockResolvedValue({ data: user })

    await expect(verifyToken()).resolves.toEqual(user)
  })
})
