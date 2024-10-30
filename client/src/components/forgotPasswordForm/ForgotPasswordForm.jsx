import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

export default function ForgotPasswordForm() {
   //validacion de los inputs de el formulario
   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = handleSubmit((data) => {
    //en esta funcion se envian los datos al backend
    //se ponen las alertas para avisar que se estan enviando los datos
    console.log(data);
  });
  return (
    <div className="w-[22rem]">
      <div className="border pt-8 pb-4 px-8 flex items-center justify-center flex-col">
        <div className="flex items-center justify-center flex-col mb-8">
          <FontAwesomeIcon
            className="mb-4 text-7xl text-gray-700"
            icon={faLock}
          />
          <p className="text-center mb-2 font-medium">
            ¿Tienes problemas para iniciar sesión?
          </p>
          <p className="text-center text-slate-600">
            Ingresa tu correo electronico y te enviaremos un enlace para que
            recuperes el acceso a tu cuenta
          </p>
        </div>
        <form className="flex flex-col w-full" onSubmit={onSubmit}>
        <input
            className="border w-full mt-3 p-2 rounded-[3px] bg-slate-100 focus:outline-double focus:outline-slate-300"
            placeholder="Email"
            type="email"
            {...register("correo", {
              required: {
                value: true,
                message: "*El email es requerido",
              },
              pattern: {
                value: /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
                message: "Por favor ingrese un correo valido",
              },
            })}
          />
          {errors.correo && (
            <span className="text-red-500 text-xs">{errors.correo.message}</span>
          )}
          <div className="border-t mt-8 pt-2">
            <button className="bg-azul-sena text-white p-2 rounded-lg mt-4 w-full">
              Regístrate
            </button>
          </div>
        </form>
      </div>
      <div className="border p-5 flex justify-center items-center">
        <Link to='/login'>
          <p className="cursor-pointer">Volver al inicio de sesión</p>
        </Link>
      </div>
    </div>
  );
}
