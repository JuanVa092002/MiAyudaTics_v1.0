import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { app } from '../core/app'
import models from '../core/models'

describe('sendMail', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    process.env.BREVO_API_KEY = 'test-key'
  })

  afterEach(() => {
    global.fetch = originalFetch
    delete process.env.BREVO_API_KEY
    vi.restoreAllMocks()
  })

  it('rechaza cuando Brevo API falla', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'server error',
    }) as typeof fetch

    const { sendMail } = await import('../shared/utils/handleEmail')
    await expect(
      sendMail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>test</p>',
      })
    ).rejects.toThrow(/Brevo API 500/)
  })

  it('usa SMTP si Brevo API bloquea IP y hay credenciales SMTP', async () => {
    process.env.BREVO_USER = 'smtp-user@test.com'
    process.env.BREVO_PASSWORD = 'smtp-pass'

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () =>
        JSON.stringify({
          message:
            'We have detected you are using an unrecognised IP address 74.220.48.235.',
          code: 'unauthorized',
        }),
    }) as typeof fetch

    const nodemailer = await import('nodemailer')
    const sendMailMock = vi.fn().mockResolvedValue({ messageId: 'smtp-ok' })
    vi.spyOn(nodemailer.default, 'createTransport').mockReturnValue({
      sendMail: sendMailMock,
    } as never)

    const { sendMail } = await import('../shared/utils/handleEmail')
    await sendMail({
      to: 'test@example.com',
      subject: 'Test',
      html: '<p>test</p>',
    })

    expect(sendMailMock).toHaveBeenCalled()
  })
})

describe('recuperarPassword — email failure visible', () => {
  it('devuelve 500 si sendMail falla', async () => {
    const user = {
      _id: '60d0fe4f5311236168a109ca',
      nombre: 'Test',
      correo: 'test@example.com',
      save: vi.fn().mockResolvedValue(undefined),
    }

    vi.spyOn(models.usuarioModel, 'findOne').mockResolvedValue(user as never)
    vi.spyOn(await import('../shared/utils/handleEmail'), 'sendMail').mockRejectedValue(
      new Error('Brevo down')
    )

    const response = await request(app)
      .post('/api/recuperarPassword')
      .send({ correo: 'test@example.com' })

    expect(response.status).toBe(500)
    expect(response.body.message).toContain('Error al enviar')
  })
})
