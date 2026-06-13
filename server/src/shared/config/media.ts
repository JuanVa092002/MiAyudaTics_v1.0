export const JWT_EXPIRES_IN_SECONDS = 2 * 60 * 60

export function getMediaMaxBytes(): number {
  const raw = process.env.MEDIA_MAX_BYTES?.trim()
  if (raw) {
    const parsed = Number.parseInt(raw, 10)
    if (!Number.isNaN(parsed) && parsed > 0) return parsed
  }
  return 10 * 1024 * 1024
}

export function isSolicitudFotoRequired(): boolean {
  return process.env.REQUIRE_SOLICITUD_FOTO === 'true'
}
