import { React, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import logoSena from "../../assets/logoSena.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";

//axios
import { register as registerService } from "../../services/auth.services.js";

export default function RegisterForm() {
  //funcionalidad de mostrar u ocultar contraseña
  const [showPwd, setShowPwd] = useState(false);
  const changeShowPwd = () => setShowPwd(!showPwd);
  const changeTypePwd = showPwd ? "Text" : "password";

  const [showCfrmPwd, setShowCfrmPwd] = useState(false);
  const ChangeShowCfrmPwd = () => setShowCfrmPwd(!showCfrmPwd);
  const changeTypeCfrmPwd = showCfrmPwd ? "Text" : "password";

  //validacion de los inputs de el formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const registerResponse = await registerService(data);
      reset();

      // Notificación de éxito dependiendo del rol del usuario
      if (data.rol === "tecnico") {
        toast.info(
          "Registro exitoso. Su cuenta de técnico está pendiente de aprobación."
        );
      } else {
        toast.success("Registro exitoso. Ahora puede iniciar sesión.");
      }
    } catch (error) {
      // Mostrar error en caso de fallo en el registro
      toast.error("Error en el registro. Por favor, intente de nuevo.");
      console.error(error);
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
        <div className="mb-8 text-sm text-slate-500">
          <p className="text-center">
            Registrate para tener acceso al servicio mesa de ayuda, su trabajo
            es importante para nosotros
          </p>
        </div>
        <form className="flex flex-col w-full" onSubmit={onSubmit}>
          <select
            className="bg-gray-300 p-2 rounded-lg text-center focus:outline-none"
            {...register("rol", {
              required: { value: true, message: "*Debe seleccionar un rol" },
            })}
          >
            <option value="" className="text-slate-600">
              Seleccione su rol
            </option>
            <option value="funcionario">Funcionario</option>
            <option value="tecnico">Técnico</option>
            <option value="lider">Líder TICS</option>
          </select>
          {errors.rol && (
            <span className="text-red-500 text-xs">{errors.rol.message}</span>
          )}

          <input
            className="border w-full mt-6 p-2 rounded-[3px] bg-slate-100 focus:outline-double focus:outline-slate-300"
            placeholder="Nombre completo"
            type="text"
            {...register("nombre", {
              required: {
                value: true,
                message: "*El nombre es requerido",
              },
              minLength: {
                value: 5,
                message: `*Debe escribir más de 5 caracteres`,
              },
              maxLength: {
                value: 50,
                message: "Debe tener menos de 50 caracteres",
              },
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "El nombre solo debe contener letras y espacios",
              },
            })}
          />
          {errors.nombre && (
            <span className="text-red-500 text-xs">{errors.nombre.message}</span>
          )}

          <input
            className="border w-full mt-3 p-2 rounded-[3px] bg-slate-100 focus:outline-double focus:outline-slate-300"
            placeholder="Número de teléfono"
            type="tel"
            {...register("telefono", {
              required: {
                value: true,
                message: "*El número es requerido",
              },
              pattern: {
                value: /^3\d{9}$/,
                message:
                  "El número de teléfono debe comenzar con 3 y tener 9 dígitos más",
              },
            })}
          />
          {errors.telefono && (
            <span className="text-red-500 text-xs">
              {errors.telefono.message}
            </span>
          )}

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
                message: "Por favor ingrese un correo válido",
              },
            })}
          />
          {errors.correo && (
            <span className="text-red-500 text-xs">{errors.correo.message}</span>
          )}

          <div className="w-full flex items-center">
            <input
              className="border w-full mt-3 p-2 rounded-[3px] bg-slate-100 focus:outline-double focus:outline-slate-300"
              placeholder="Contraseña"
              type={changeTypePwd}
              {...register("password", {
                required: {
                  value: true,
                  message: "*La contraseña es requerida",
                },
                pattern: {
                  value: /^(?=.*\d).{6,}$/,
                  message:
                    "La contraseña debe tener al menos 6 caracteres, un número y un carácter especial.",
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

          <div>
            <input
              className="border w-full mt-3 p-2 rounded-[3px] bg-slate-100 focus:outline-double focus:outline-slate-300"
              placeholder="Confirmar contraseña"
              type={changeTypeCfrmPwd}
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "*Confirmar la contraseña es requerido",
                },
                validate: (value) =>
                  value === watch("password") || "La contraseña no coincide",
              })}
            />
            <span onClick={ChangeShowCfrmPwd} className="mt-3 -ml-7 z-10">
              {showCfrmPwd ? (
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
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </span>
          )}

          <div className="border-t mt-6">
            <button className="bg-azul-sena text-white p-2 rounded-lg mt-4 w-full">
              Regístrate
            </button>
          </div>
        </form>
      </div>
      <div className="border p-5 flex justify-center items-center mb-6">
        <p className="text-slate-500">
          ¿Tienes una cuenta?{" "}
          <Link className="text-verde-sena cursor-pointer" to="/login">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
