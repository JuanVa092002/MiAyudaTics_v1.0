import type { ReactNode } from 'react'
import { NavTecnico } from '@/features/tickets'

interface TecnicoLayoutProps {
  children: ReactNode
}

export default function TecnicoLayout({ children }: TecnicoLayoutProps): ReactNode {
  return (
    <div className="flex w-full max-w-[90%]">
      <NavTecnico />
      <div className="w-full">{children}</div>
    </div>
  )
}
