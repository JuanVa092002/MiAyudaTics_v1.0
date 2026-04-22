import React, { useContext } from 'react'
import { AuthContext } from '../../context/Auth.context'
import LogOut from '../logOut/LogOut'

export default function NavApp() {
  const { user } = useContext(AuthContext)

  return (
    <header className="w-full bg-white border-b hairline-border border-slate-200 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-8 h-20 max-w-[1400px] mx-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined !text-[24px]">bolt</span>
          </div>
          <span className="text-xl font-black text-primary-container tracking-tight">AyudaTIC</span>
        </div>

        {/* Search Bar Section (Visual only for now) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-12">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] transition-transform group-focus-within:scale-110">search</span>
            <input 
              className="w-full pl-12 pr-4 py-3 solid-input rounded-2xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/10 transition-all placeholder:text-slate-400" 
              placeholder="Buscar en la plataforma..." 
              type="text"
            />
          </div>
        </div>

        {/* Actions & Profile Section */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 text-on-surface-variant hover:bg-slate-100 rounded-2xl transition-all flex items-center justify-center border border-transparent hover:border-slate-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="w-10 h-10 text-on-surface-variant hover:bg-slate-100 rounded-2xl transition-all flex items-center justify-center border border-transparent hover:border-slate-200">
            <span className="material-symbols-outlined">settings</span>
          </button>
          
          <div className="flex items-center gap-4 ml-4 pl-4 border-l hairline-border border-slate-200">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-on-surface">{user?.nombre || 'Usuario'}</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant opacity-60">{user?.rol || 'Funcionario'}</span>
            </div>
            <div className="p-0.5 rounded-2xl border hairline-border border-slate-200 bg-slate-50 overflow-hidden">
              <img 
                alt="Avatar" 
                className="w-10 h-10 rounded-[20px] object-cover shadow-sm" 
                src={user?.foto?.url || "https://ui-avatars.com/api/?name=" + (user?.nombre || "U") + "&background=002b40&color=fff"}
              />
            </div>
            <LogOut />
          </div>
        </div>
      </div>
    </header>
  )
}
