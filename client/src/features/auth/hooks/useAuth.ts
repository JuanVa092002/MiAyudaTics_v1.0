import { useContext } from 'react'
import { AuthContext } from '@/features/auth/context/auth-context'
import type { AuthContextValue } from '@/shared/types'

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
