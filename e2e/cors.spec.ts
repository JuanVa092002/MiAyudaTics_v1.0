import { test, expect } from '@playwright/test'

const backendUrl = process.env.E2E_BACKEND_URL ?? 'https://miayudatics-v1-0.onrender.com'

test('health responde desde contexto browser con CORS', async ({ page }) => {
  await page.goto('/loginMain')

  const result = await page.evaluate(async (apiBase) => {
    const res = await fetch(`${apiBase}/api/health`, { credentials: 'include' })
    const body = await res.json()
    return { status: res.status, body }
  }, backendUrl)

  expect(result.status).toBe(200)
  expect(result.body.status).toBe('ok')
  expect(result.body.database).toBe('connected')
  if (result.body.integrations) {
    expect(result.body.integrations.cloudinary).toBeDefined()
    expect(result.body.integrations.brevo).toBeDefined()
  }
})

test('frontend carga loginMain', async ({ page }) => {
  await page.goto('/loginMain')
  await expect(page).toHaveTitle(/MiAyudaTIC/i)
  await expect(page.locator('#root')).toBeVisible()
})

test('SPA deep link no devuelve 404 de plataforma', async ({ page }) => {
  const response = await page.goto('/adminSolicitud')
  expect(response?.status()).toBe(200)
  await expect(page.locator('#root')).toBeVisible()
})
