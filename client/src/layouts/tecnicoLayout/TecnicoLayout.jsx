import React from "react";
import NavTecnico from "../../components/tecnico/NavTecnico";

export default function TecnicoLayout({ children }) {
  return (
    <div className="flex w-full max-w-[90%]">
        <NavTecnico/>
      <div className="w-full">{children}</div>
    </div>
  );
}
