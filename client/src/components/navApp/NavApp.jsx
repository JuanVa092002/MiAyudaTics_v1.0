import React from "react";
import Profile from "../profile/Profile";
import LogOut from "../logOut/LogOut";

export default function NavApp() {
  return (
    <nav className="py-2 w-full bg-azul-sena flex justify-center">
      <div className="w-full max-w-[90%] flex justify-between items-center pl-4">
        <div>
          <p className="text-2xl text-white font-semibold">Mi Ayuda TICS</p>
        </div>
        <div>
          <div className="flex gap-8 items-center">
            <Profile />
            <LogOut />
          </div>
        </div>
      </div>
    </nav>
  );
}
