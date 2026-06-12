/**
 * Verifica variables de entorno y conectividad básica.
 * Uso: pnpm -C server run verify:env
 */
import 'dotenv/config'
import mongoose from 'mongoose'
import { configureMongoDns } from '../shared/config/mongo'
import { isCloudinaryEnabled, cloudinary, ensureCloudinaryConfig } from '../shared/config/cloudinary'

type CheckResult = { name: string; ok: boolean; detail: string }

const results: CheckResult[] = []

function record(name: string, ok: boolean, detail: string): void {
  results.push({ name, ok, detail })
}

function checkRequired(name: string, value: string | undefined): void {
  record(name, Boolean(value?.trim()), value?.trim() ? 'configurado' : 'falta o vacío')
}

async function checkMongo(): Promise<void> {
  const uri = process.env.DB_URI?.trim()
  if (!uri) {
    record('MongoDB Atlas', false, 'DB_URI no definida')
    return
  }

  try {
    configureMongoDns()
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
    await mongoose.connection.db?.admin().ping()
    record('MongoDB Atlas', true, 'conexión OK')
    await mongoose.disconnect()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    record('MongoDB Atlas', false, message)
  }
}

async function checkCloudinary(): Promise<void> {
  if (!isCloudinaryEnabled()) {
    record('Cloudinary', false, 'credenciales incompletas (usa STORAGE_PATH local)')
    return
  }

  try {
    ensureCloudinaryConfig()
    await cloudinary.api.ping()
    record('Cloudinary', true, `cuenta ${process.env.CLOUDINARY_CLOUD_NAME}`)
  } catch (error) {
    const message =
      (error as { error?: { message?: string } })?.error?.message ||
      (error instanceof Error ? error.message : String(error))
    record('Cloudinary', false, message)
  }
}

function checkBrevo(): void {
  const hasApi = Boolean(process.env.BREVO_API_KEY?.trim())
  const hasSmtp = Boolean(process.env.BREVO_USER?.trim() && process.env.BREVO_PASSWORD?.trim())
  record('Brevo (email)', hasApi || hasSmtp, hasApi ? 'API key configurada' : hasSmtp ? 'SMTP configurado' : 'sin credenciales')
}

function checkUrls(): void {
  const client = process.env.CLIENT_URL?.trim()
  const publicUrl = process.env.PUBLIC_URL?.trim()
  record('CLIENT_URL', Boolean(client), client || 'falta')
  record('PUBLIC_URL', Boolean(publicUrl), publicUrl || 'falta')
}

async function main(): Promise<void> {
  console.log('=== MiAyudaTIC — verificación de entorno ===\n')

  checkRequired('NODE_ENV', process.env.NODE_ENV)
  checkRequired('JWT_SECRET', process.env.JWT_SECRET)
  checkUrls()
  checkBrevo()

  await checkMongo()
  await checkCloudinary()

  const storageMode = isCloudinaryEnabled() ? 'Cloudinary' : `local (${process.env.STORAGE_PATH || 'storage'})`
  record('Modo storage', true, storageMode)

  console.log('Variable / Servicio          Estado   Detalle')
  console.log('---------------------------  -------  --------------------------------')
  for (const row of results) {
    const status = row.ok ? 'OK' : 'FAIL'
    console.log(`${row.name.padEnd(27)}  ${status.padEnd(7)}  ${row.detail}`)
  }

  const failed = results.filter(r => !r.ok)
  console.log('')
  if (failed.length === 0) {
    console.log('=== TODO OK ===')
    process.exit(0)
  }

  console.log(`=== ${failed.length} problema(s) — revisa server/.env ===`)
  process.exit(1)
}

main()
