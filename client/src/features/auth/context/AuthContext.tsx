import { useState, useEffect, type ReactNode } from 'react'
import { verifyToken } from '@/features/auth/api/auth.service'
import type { User } from '@/shared/types'
import { AuthContext } from '@/features/auth/context/auth-context'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps): ReactNode {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async (): Promise<void> => {
      setLoading(true)
      try {
        const response = await verifyToken()
        if (!response) {
          setIsAuthenticated(false)
          setUser(null)
          return
        }
        setIsAuthenticated(true)
        setUser(response)
      } catch {
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    void checkLogin()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
