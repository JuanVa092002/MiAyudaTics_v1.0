export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim()
  if (!secret) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno')
  }
  return secret
}

export function assertJwtSecretOnBoot(): void {
  if (process.env.NODE_ENV === 'test') return
  getJwtSecret()
}
