import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { logout } from '../../services/auth.services'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/Auth.context'

export default function LogOut() {
  const { setUser, setIsAuthenticated } = useContext(AuthContext)

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const logOutResponse = await logout()
      console.log(logOutResponse)
      setUser(null)
      setIsAuthenticated(false)
      navigate('/loginMain')
    } catch (error) {
      console.log('Error al cerrar sesion.')
    }
  }
  return (
    <button 
      onClick={handleLogout}
      className="w-10 h-10 text-on-surface-variant hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all flex items-center justify-center border border-transparent hover:border-red-100"
      title="Cerrar Sesión"
    >
      <span className="material-symbols-outlined !text-[24px]">logout</span>
    </button>
  )
}
