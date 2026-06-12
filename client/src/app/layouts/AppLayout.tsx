import type { ReactNode } from 'react'
import { NavApp } from '@/shared/ui'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps): ReactNode {
  return (
    <div className="w-full flex flex-col items-center">
      <NavApp />
      <div className="w-full flex justify-center overflow-y-auto">{children}</div>
    </div>
  )
}
