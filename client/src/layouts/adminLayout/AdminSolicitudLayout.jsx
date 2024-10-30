import React from 'react'
import NavSolicitud from '../../components/navAdmin/NavSolicitud'

export default function AdminSolicitudLayout({children}) {
  return (
    <div className="w-full">
        <NavSolicitud/>
        <div className="w-full">{children}</div>
    </div>
  )
}
