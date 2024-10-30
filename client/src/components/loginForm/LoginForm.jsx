import { React, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import logoSena from "../../assets/logoSena.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

import { login as loginService } from "../../services/auth.services";
import { AuthContext } from "../../context/Auth.context";

export default function LoginForm() {
  const navigate = useNavigate();
  //funcionalidad de mostrar u ocultar contraseña
  //mostrar u ocultar contraseña
  const [showPwd, setShowPwd] = useState(false);
  const changeShowPwd = () => setShowPwd(!showPwd);
  //cambiar el typo de caracter de el input
  const changeTypePwd = showPwd ? "Text" : "password";

  const { setUser, setIsAuthenticated, user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const response = await loginService(data);
    
    try {

      setUser(response.data.dataUser.user);
      setIsAuthenticated(true);

      const userRol = response.data.dataUser.user.rol;
      switch (userRol) {
        case "funcionario":
          navigate("/funcionario");
          break;
        case "tecnico":
          navigate("/casos-por-resolver");
          break;
        case "lider":
          navigate("/adminSolicitud");
          break;
      }
          
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  });



  return (
    <div className="w-[22rem]">
      <div className="border mb-4 pt-8 pb-4 px-8 flex items-center justify-center flex-col">
        <div className="flex items-center justify-center mb-8">
          <img
            className="w-32 border-r mr-4"
            src={logoSena}
            alt="logosimbolo Sena"
          />
          <p className="text-verde-sena text-xl font-semibold">MiAyudaTIC</p>
        </div>
        <form
          className="flex flex-col pb-8 border-b w-full"
          onSubmit={onSubmit}
        >
          <input
            className="border w-full mt-3 p-2 rounded-[3px] bg-slate-100 focus:outline-double focus:outline-slate-300"
            placeholder="Correo"
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
            <span className="text-red-500 text-xs">
              {errors.correo.message}
            </span>
          )}
          <div className="w-full flex items-center">
            <input
              className="border w-full mt-3 p-2 rounded-[3px] bg-slate-100 focus:outline-double focus:outline-slate-300"
              placeholder="Contraseña"
              type={changeTypePwd}
              {...register("password", {
                required: {
                  value: true,
                  message: "*La contraseña es requerido",
                },
                pattern: {
                  value: /^(?=.*\d).{6,}$/,
                  message:
                    "La contraseña debe tener al menos 6 caracteres y un numero",
                },
              })}
            />
            <span onClick={changeShowPwd} className="mt-3 -ml-7 z-10">
              {showPwd ? (
                <FontAwesomeIcon
                  className="cursor-pointer text-slate-600"
                  icon={faEye}
                />
              ) : (
                <FontAwesomeIcon
                  className="cursor-pointer text-slate-600"
                  icon={faEyeSlash}
                />
              )}
            </span>
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
          <button className="bg-azul-sena text-slate-200 hover:text-white mt-6 p-2 rounded-[3px]">
            Iniciar sesión
          </button>
        </form>
        <Link to="/forgot">
          <p className="mt-4 cursor-pointer">¿Olvidaste tu contraseña?</p>
        </Link>
      </div>
      <div className="border p-5 flex justify-center items-center">
        <p className="text-slate-500">
          ¿No tienes una cuenta?{" "}
          <Link className="text-verde-sena cursor-pointer" to="/register">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
