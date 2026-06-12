import { useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { verifyToken } from '@/features/auth/api/auth.service'
import { setUnauthorizedHandler } from '@/shared/api/apiError'
import type { User } from '@/shared/types'
import { AuthContext } from '@/features/auth/context/auth-context'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps): ReactNode {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null)
      setIsAuthenticated(false)
      toast.info('Tu sesión expiró. Inicia sesión nuevamente.')
      navigate('/loginMain', { replace: true })
    })
  }, [navigate])

  useEffect(() => {
    const checkLogin = async (): Promise<void> => {
      setLoading(true)
      try {
        const response = await verifyToken()
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
