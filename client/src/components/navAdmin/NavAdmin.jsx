import React from "react";
import { Link } from "react-router-dom";

export default function NavAdmin() {
  return (
    <div className="w-full max-w-[13%] py-8 border-r border-azul-sena h-screen">
      <div>
        <ol className="flex flex-col gap-4">
          <Link
            className=" font-semibold text-azul-sena text-xl bg-white px-4 py-3 transition-all hover:bg-azul-sena hover:text-white "
            to="/adminSolicitud"
          >
            <li> Solicitudes </li>
          </Link>
          <Link
            className=" font-semibold text-azul-sena text-xl bg-white px-4 py-3 transition-all hover:bg-azul-sena hover:text-white "
            to="/adminTecnicos"
          >
            <li>Tecnicos </li>
          </Link>
          <Link
            className=" font-semibold text-azul-sena text-xl bg-white px-4 py-3 transition-all hover:bg-azul-sena hover:text-white "
            to="/adminEstadisticas"
          > 
            <li> Estadisticas </li>
          </Link>
          <Link
            className=" font-semibold text-azul-sena text-xl bg-white px-4 py-3 transition-all hover:bg-azul-sena hover:text-white "
            to="/adminAmbientes"
          >
            <li> Ambientes </li>
          </Link>
          <Link
            className=" font-semibold text-azul-sena text-xl bg-white px-4 py-3 transition-all hover:bg-azul-sena hover:text-white "
            to='/adminCasos'
          >
            <li> Tipo de soporte </li>
          </Link>
        </ol>
      </div>
    </div>
  );
}
