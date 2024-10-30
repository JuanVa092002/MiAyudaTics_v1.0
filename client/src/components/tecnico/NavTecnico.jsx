import React from "react";
import { Link } from "react-router-dom";

export default function NavTecnico() {
  return (
    <div className="w-full max-w-[13%] py-8 border-r border-azul-sena">
      <div>
        <ol className="flex flex-col gap-4">
          <Link
            className=" font-semibold text-azul-sena text-xl bg-white px-4 py-3 transition-all hover:bg-azul-sena hover:text-white "
            to="/casos-por-resolver"
          >
            <li> Casos por resolver </li>
          </Link>
          <Link
            className=" font-semibold text-azul-sena text-xl bg-white px-4 py-3 transition-all hover:bg-azul-sena hover:text-white "
            to="/casos-resueltos"
          > 
            <li> Casos Resueltos </li>
          </Link>
        
        </ol>
      </div>
    </div>
  );
}
