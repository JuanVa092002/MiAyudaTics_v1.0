import React from "react";
import LoginLayout from "../../layouts/loginLayout/LoginLayout";
import LoginForm from "../../components/loginForm/LoginForm";


export default function LoginMain() {
  return (
    <LoginLayout>
      <div className="flex w-full max-w-[55%] justify-between">
        <div className="flex justify-center flex-col pr-8">
          <p className="text-verde-sena text-7xl w-full max-w-full">
            Mi ayuda TIC
          </p>
          <p className="text-4xl w-full max-w-[80%] mt-3">
            Centro de teleinformática y Producción Industrial
          </p>
          <p className="text-3xl text-slate-500 w-full max-w-[60%] mt-2">
            Regional Cauca
          </p>
        </div>
        <div>
          <LoginForm />
        </div>
      </div>
    </LoginLayout>
  );
}
