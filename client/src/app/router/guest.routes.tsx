import { type ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getRoleHome } from '@/app/router/roleHome'
import Loaders from '@/shared/ui/Loaders'

export default function GuestOnlyRoutes(): ReactNode {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) return <Loaders />

  if (isAuthenticated && user?.rol) {
    return <Navigate to={getRoleHome(user.rol)} replace />
  }

  return <Outlet />
}
