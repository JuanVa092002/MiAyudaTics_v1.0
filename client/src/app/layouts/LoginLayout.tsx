import type { ReactNode } from 'react'
import { NavLoginMain } from '@/shared/ui'

interface LoginLayoutProps {
  children: ReactNode
}

export default function LoginLayout({ children }: LoginLayoutProps): ReactNode {
  return (
    <div>
      <div>
        <NavLoginMain />
      </div>
      <div className="flex justify-center items-center pt-20">{children}</div>
    </div>
  )
}
