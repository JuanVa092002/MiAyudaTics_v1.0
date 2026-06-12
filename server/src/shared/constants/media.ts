export const DEFAULT_AVATAR_FILENAME = 'usuario-undefined.png'

export function isDefaultAvatar(filename: string | undefined | null): boolean {
  if (!filename) return false
  return (
    filename === DEFAULT_AVATAR_FILENAME ||
    filename.endsWith('/usuario-undefined') ||
    filename.endsWith('/usuario-undefined.png')
  )
}
