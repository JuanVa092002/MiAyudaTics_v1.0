import { type ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getRoleHome } from '@/app/router/roleHome'

export default function GuestOnlyRoutes(): ReactNode {
  const { isAuthenticated, loading, user } = useAuth()

  // Do not block guest UI while verify-token runs (e.g. Render cold start).
  if (!loading && isAuthenticated && user?.rol) {
    return <Navigate to={getRoleHome(user.rol)} replace />
  }

  return <Outlet />
}
