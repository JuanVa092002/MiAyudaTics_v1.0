const JPEG = (buffer: Buffer): boolean => buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8
const PNG = (buffer: Buffer): boolean =>
  buffer.length >= 8 &&
  buffer[0] === 0x89 &&
  buffer[1] === 0x50 &&
  buffer[2] === 0x4e &&
  buffer[3] === 0x47
const GIF = (buffer: Buffer): boolean =>
  buffer.length >= 6 && buffer.subarray(0, 3).toString('ascii') === 'GIF'
const WEBP = (buffer: Buffer): boolean =>
  buffer.length >= 12 &&
  buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
  buffer.subarray(8, 12).toString('ascii') === 'WEBP'
const PDF = (buffer: Buffer): boolean =>
  buffer.length >= 4 && buffer.subarray(0, 4).toString('ascii') === '%PDF'

function isHeicFamily(buffer: Buffer): boolean {
  if (buffer.length < 12) return false
  const ftyp = buffer.subarray(4, 8).toString('ascii')
  if (ftyp !== 'ftyp') return false
  const brand = buffer.subarray(8, 12).toString('ascii').toLowerCase()
  return brand.startsWith('heic') || brand.startsWith('heif') || brand.startsWith('mif1')
}

const SIGNATURE_CHECKS: Array<{ mime: string; check: (buffer: Buffer) => boolean }> = [
  { mime: 'image/jpeg', check: JPEG },
  { mime: 'image/jpg', check: JPEG },
  { mime: 'image/png', check: PNG },
  { mime: 'image/gif', check: GIF },
  { mime: 'image/webp', check: WEBP },
  { mime: 'image/heic', check: isHeicFamily },
  { mime: 'image/heif', check: isHeicFamily },
  { mime: 'application/pdf', check: PDF },
]

export function detectMediaMime(buffer: Buffer): string | null {
  for (const { mime, check } of SIGNATURE_CHECKS) {
    if (check(buffer)) return mime
  }
  return null
}

export function assertValidMediaBuffer(buffer: Buffer, declaredMime: string): void {
  const detected = detectMediaMime(buffer)
  if (!detected) {
    throw new Error('UNSUPPORTED_MEDIA')
  }

  const normalizedDeclared = declaredMime.toLowerCase()
  const imageFamily = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'])
  const detectedFamily = imageFamily.has(detected) ? 'image' : detected
  const declaredFamily = imageFamily.has(normalizedDeclared) ? 'image' : normalizedDeclared

  if (detectedFamily !== declaredFamily && detected !== normalizedDeclared) {
    if (detectedFamily === 'image' && declaredFamily === 'image') {
      return
    }
    throw new Error('UNSUPPORTED_MEDIA')
  }
}
