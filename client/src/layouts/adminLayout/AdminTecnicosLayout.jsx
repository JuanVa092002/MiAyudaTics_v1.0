import React from 'react'
import NavTecnicos from '../../components/navTecnicos/NavTecnicos'

export default function AdminTecnicosLayout({children}) {
  return (
    <div className="w-full">
        <NavTecnicos/>
        <div className="w-full">{children}</div>
    </div>
  )
}
