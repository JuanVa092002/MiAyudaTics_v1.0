import React from "react";
import NavAdmin from "../../components/navAdmin/NavAdmin";

export default function AdminLayout({ children }) {
  return (
    <div className="flex w-full max-w-[90%]">
        <NavAdmin />
      <div className="w-full">{children}</div>
    </div>
  );
}
