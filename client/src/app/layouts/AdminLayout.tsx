import type { ReactNode } from 'react'
import { NavAdmin } from '@/features/users'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps): ReactNode {
  return (
    <div className="flex w-full max-w-[90%]">
      <NavAdmin />
      <div className="w-full">{children}</div>
    </div>
  )
}
