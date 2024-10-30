import React from 'react'
import { Link } from 'react-router-dom'

export default function NavSolicitud() {
  return (
    <div className="pl-8 pt-8">
    <ul className="flex text-lg gap-8">
    <Link to="/adminSolicitud"  className="font-medium border-b-2  border-verde-sena text-verde-sena hover:text-azul-sena hover:border-azul-sena transition-all">
        <li> Solicitudes asignadas </li>
      </Link>
      <Link to="/seguimiento"  className="font-medium border-b-2  border-verde-sena text-verde-sena hover:text-azul-sena hover:border-azul-sena transition-all">
        <li> Seguimiento </li>
      </Link>
      
    </ul>
  </div>
  )
}
