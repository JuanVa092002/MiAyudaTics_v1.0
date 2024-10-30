import React from "react";
import LoginLayout from "../../layouts/loginLayout/LoginLayout";
import RegisterForm from "../../components/registerForm/RegisterForm";

export default function RegisterLogin() {
  return (
    <LoginLayout>
      <RegisterForm/>
    </LoginLayout>
  );
}
