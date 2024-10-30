import React from 'react'
import { Link } from 'react-router-dom'

export default function NavTecnicos() {
  return (
    <div className="pl-8 pt-8">
    <ul className="flex text-lg gap-8">
      <Link to="/adminTecnicos"  className="font-medium border-b-2  border-verde-sena text-verde-sena hover:text-azul-sena hover:border-azul-sena transition-all">
        <li> Tecnicos por aprobar </li>
      </Link>
      <Link to="/tecnicosActivos" className="font-medium border-b-2  border-verde-sena text-verde-sena hover:text-azul-sena hover:border-azul-sena transition-all">
        <li> Tecnicos activos </li>
      </Link>
      <Link to="/tecnicosInactivos" className="font-medium border-b-2  border-verde-sena text-verde-sena hover:text-azul-sena hover:border-azul-sena transition-all">
        <li> Tecnicos inactivos </li>
      </Link>
    </ul>
  </div>
  )
}
