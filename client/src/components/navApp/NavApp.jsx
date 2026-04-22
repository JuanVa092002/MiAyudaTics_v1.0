import React, { useContext, useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/Auth.context'
import LogOut from '../logOut/LogOut'

export default function NavApp() {
  const { user } = useContext(AuthContext)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  
  const notificationsRef = useRef(null)
  const profileRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getDashboardLink = () => {
    const rol = user?.rol?.toLowerCase()
    if (rol === 'administrador') return '/adminSolicitud'
    if (rol === 'tecnico') return '/casos-por-resolver'
    return '/funcionario'
  }

  return (
    <header className="w-full bg-white border-b hairline-border border-slate-200 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-8 h-20 max-w-[1800px] mx-auto">
        {/* Logo Section - Functional Link */}
        <Link 
          to={getDashboardLink()} 
          className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
        >
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-container/20 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined !text-[24px]">bolt</span>
          </div>
          <span className="text-xl font-black text-primary-container tracking-tight">AyudaTIC</span>
        </Link>

        {/* Actions & Profile Section */}
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Quick Actions */}
          <div className="flex items-center gap-1 relative" ref={notificationsRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`group w-10 h-10 rounded-full transition-all flex items-center justify-center relative ${showNotifications ? 'bg-primary-container text-white shadow-md' : 'text-on-surface-variant hover:bg-primary-container/5'}`}
            >
              <span className="material-symbols-outlined !text-[22px] transition-all group-hover:font-variation-['FILL'_1]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white solid-card rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                <div className="flex items-center justify-between mb-4 pb-2 border-b hairline-border border-slate-100">
                  <h4 className="text-sm font-bold text-on-surface">Notificaciones</h4>
                  <span className="text-[10px] font-bold text-primary-container uppercase cursor-pointer hover:underline">Marcar leídas</span>
                </div>
                <div className="flex flex-col items-center py-8 opacity-40">
                  <span className="material-symbols-outlined !text-[48px] mb-2 font-variation-['wght'_300]">notifications_off</span>
                  <p className="text-xs font-bold uppercase tracking-widest text-center leading-relaxed">Sin avisos pendientes</p>
                </div>
              </div>
            )}

            <button className="group w-10 h-10 text-on-surface-variant hover:bg-primary-container/5 rounded-full transition-all flex items-center justify-center">
              <span className="material-symbols-outlined !text-[22px] transition-all group-hover:rotate-45 group-hover:font-variation-['FILL'_1]">settings</span>
            </button>
          </div>
          
          {/* User Profile - Zero Borders, Tonal Hover */}
          <div className="relative" ref={profileRef}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-3 px-3 py-1.5 rounded-2xl transition-all cursor-pointer group ml-2 ${showProfileMenu ? 'bg-slate-100 shadow-inner' : 'hover:bg-slate-50'}`}
            >
              <div className="flex flex-col items-end hidden sm:flex text-right">
                <span className="text-sm font-bold text-on-surface leading-tight group-hover:text-primary-container transition-colors line-clamp-1">{user?.nombre || 'Usuario'}</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-40 leading-tight">{user?.rol || 'Funcionario'}</span>
              </div>
              <div className="relative">
                <img 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-transparent group-hover:ring-primary-container/10 transition-all bg-slate-100" 
                  src={user?.foto?.url || "https://ui-avatars.com/api/?name=" + (user?.nombre || "U") + "&background=002b40&color=fff"}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-verde-sena border-2 border-white rounded-full shadow-sm"></span>
              </div>
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white solid-card rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                <div className="p-3 border-b hairline-border border-slate-100 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Conectado como</p>
                  <p className="text-xs font-bold text-on-surface truncate">{user?.correo || 'correo@ejemplo.com'}</p>
                </div>
                <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                  <span className="material-symbols-outlined !text-[20px] text-slate-400 group-hover:text-primary-container transition-colors font-variation-['wght'_300]">account_circle</span>
                  <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary-container">Mi Perfil</span>
                </button>
                <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group border-b hairline-border border-slate-100 pb-3 mb-1">
                  <span className="material-symbols-outlined !text-[20px] text-slate-400 group-hover:text-primary-container transition-colors font-variation-['wght'_300]">verified_user</span>
                  <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary-container">Seguridad</span>
                </button>
                <div className="p-1">
                  <LogOut />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
