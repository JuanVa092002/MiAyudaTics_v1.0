import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, logout } from '@/features/auth'

export default function LogOut(): ReactNode {
  const { setUser, setIsAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async (): Promise<void> => {
    try {
      await logout()
      setUser(null)
      setIsAuthenticated(false)
      navigate('/loginMain')
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error al cerrar sesion.', error)
      }
    }
  }

  return (
    <button
      onClick={() => void handleLogout()}
      className="w-10 h-10 text-on-surface-variant hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all flex items-center justify-center border border-transparent hover:border-red-100"
      title="Cerrar Sesión"
    >
      <span className="material-symbols-outlined !text-[24px]">logout</span>
    </button>
  )
}
