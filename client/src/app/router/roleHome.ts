import type { UserRole } from '@/shared/types'

const ROLE_HOME: Record<UserRole, string> = {
  funcionario: '/funcionario',
  tecnico: '/casos-por-resolver',
  lider: '/adminSolicitud',
}

export function getRoleHome(rol: UserRole | string | undefined): string {
  if (!rol) return '/loginMain'
  const normalized = rol.toLowerCase() as UserRole
  if (normalized in ROLE_HOME) {
    return ROLE_HOME[normalized]
  }
  return '/loginMain'
}
