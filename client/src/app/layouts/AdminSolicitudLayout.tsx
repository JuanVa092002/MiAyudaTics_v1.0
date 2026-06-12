import type { ReactNode } from 'react'
import { NavSolicitud } from '@/features/users'

interface AdminSolicitudLayoutProps {
  children: ReactNode
}

export default function AdminSolicitudLayout({ children }: AdminSolicitudLayoutProps): ReactNode {
  return (
    <div className="w-full">
      <NavSolicitud />
      <div className="w-full">{children}</div>
    </div>
  )
}
