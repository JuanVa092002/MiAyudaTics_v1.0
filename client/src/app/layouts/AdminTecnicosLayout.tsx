import type { ReactNode } from 'react'
import { NavTecnicos } from '@/features/users'

interface AdminTecnicosLayoutProps {
  children: ReactNode
}

export default function AdminTecnicosLayout({ children }: AdminTecnicosLayoutProps): ReactNode {
  return (
    <div className="w-full">
      <NavTecnicos />
      <div className="w-full">{children}</div>
    </div>
  )
}
