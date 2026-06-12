import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { Loaders } from '@/shared/ui'
import { getRoleHome } from '@/app/router/roleHome'
import type { UserRole } from '@/shared/types'

interface RequireRoleProps {
  roles: UserRole[]
}

export default function RequireRole({ roles }: RequireRoleProps): ReactNode {
  const { user, loading } = useAuth()

  if (loading) return <Loaders />
  if (!user) return <Navigate to="/loginMain" replace />

  const userRole = user.rol.toLowerCase() as UserRole
  if (!roles.includes(userRole)) {
    return <Navigate to={getRoleHome(user.rol)} replace />
  }

  return <Outlet />
}
