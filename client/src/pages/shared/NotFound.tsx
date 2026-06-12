import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(): ReactNode {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#39a900]">404</p>
      <h1 className="mt-2 text-3xl font-bold text-[#04324d]">Página no encontrada</h1>
      <p className="mt-3 max-w-md text-slate-600">
        La ruta que buscas no existe o ya no está disponible.
      </p>
      <Link
        to="/loginMain"
        className="mt-8 rounded-lg bg-[#04324d] px-6 py-3 text-sm font-semibold text-white hover:bg-[#032030]"
      >
        Ir al inicio
      </Link>
    </div>
  )
}
