import React from "react";
import { Link } from "react-router-dom";

export default function NavLoginMain() {
  return (
    <nav className="flex justify-center items-center border-b">
      <div className="w-full max-w-[55%] flex justify-between py-3">
        <Link to="/loginMain">
          <p className="text-verde-sena text-3xl font-semibold cursor-pointer">
            AyudaTIC
          </p>
        </Link>
        <div className="flex gap-2 items-center">
          <Link to="/login">
            <button className="bg-azul-sena text-lg px-3 py-1 text-slate-200 font-medium rounded-xl hover:text-white">
              Iniciar sesión
            </button>
          </Link>
          <Link to="/register">
            <p className="text-azul-sena text-lg cursor-pointer font-medium">
              Regístrate
            </p>
          </Link>
        </div>
      </div>
    </nav>
  );
}
