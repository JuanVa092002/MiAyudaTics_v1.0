import React from "react";
import NavLoginMain from "../../components/navLoginMain/NavLoginMain";

export default function LoginLayout({ children }) {
  return (
      <div>
        <div>
          <NavLoginMain />
        </div>
        <div className="flex justify-center items-center pt-20">{children}</div>
      </div>
  );
}
