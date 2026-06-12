import type { ReactNode } from 'react'

export default function Loaders(): ReactNode {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#04324d]" />
      <p className="text-sm font-medium text-slate-600">Cargando...</p>
    </div>
  )
}
