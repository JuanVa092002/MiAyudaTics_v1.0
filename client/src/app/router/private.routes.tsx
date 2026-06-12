import type { ReactNode } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { Loaders } from '@/shared/ui'

export default function PrivateRoutes(): ReactNode {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) return <Loaders />
  if (!isAuthenticated || !user) return <Navigate to="/loginMain" replace />

  return <Outlet />
}
