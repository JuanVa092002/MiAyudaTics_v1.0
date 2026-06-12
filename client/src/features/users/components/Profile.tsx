import type { ReactNode } from 'react'
import { useAuth } from '@/features/auth'
import type { MediaFile } from '@/shared/types'

function getFotoUrl(foto: MediaFile | string | undefined): string {
  if (!foto) return ''
  if (typeof foto === 'string') return foto
  return foto.url
}

export default function Profile(): ReactNode {
  const { user } = useAuth()
  const imageUrl = getFotoUrl(user?.foto)

  if (!user) return null

  return (
    <div className="flex bg-gray-100 hover:bg-white  py-[1px] pr-5 pl-1 rounded-full items-center">
      <div className="mr-4">
        <img src={imageUrl} alt="Imagen de perfil" className="w-9 h-9 rounded-full" />
      </div>
      <div className="text-sm text-azul-sena">
        <p>{user.nombre}</p>
        <p>{user.rol}</p>
      </div>
    </div>
  )
}
