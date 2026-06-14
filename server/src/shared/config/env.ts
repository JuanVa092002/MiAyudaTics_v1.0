import { isCloudinaryEnabled } from './cloudinary'

const REQUIRED_IN_PRODUCTION = ['DB_URI', 'JWT_SECRET'] as const

export function validateEnvOnBoot(): void {
  if (process.env.NODE_ENV === 'test') return

  const missing = REQUIRED_IN_PRODUCTION.filter(key => !process.env[key]?.trim())
  if (process.env.NODE_ENV === 'production' && missing.length > 0) {
    throw new Error(`Variables de entorno requeridas: ${missing.join(', ')}`)
  }

  if (process.env.NODE_ENV === 'production' && !isCloudinaryEnabled()) {
    throw new Error(
      'Cloudinary es obligatorio en producción (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)'
    )
  }

  if (!process.env.JWT_SECRET?.trim() && process.env.NODE_ENV !== 'production') {
    console.warn('[env] JWT_SECRET no configurado — solo válido en desarrollo con .env')
  }
}
