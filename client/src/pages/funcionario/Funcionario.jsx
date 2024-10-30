import { useState, useEffect } from "react";
import {
  obtenerAmbientes,
  crearSolicitud,
} from "../../services/solicitud.services";
import AppLayout from "../../layouts/appLayout/AppLayout";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import HistorialFuncionario from "./HistorialFuncionario";

export default function Funcionario() {
  const { register, handleSubmit, reset, watch } = useForm();
  const [ambientes, setAmbientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // Estado para la vista previa de la imagen
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Estado para el modal de la imagen ampliada

  const watchFoto = watch("foto"); // Verifica el cambio en el input de la foto

  useEffect(() => {
    const fetchAmbientes = async () => {
      try {
        const response = await obtenerAmbientes();
        const data = response.data;

        if (Array.isArray(data)) {
          setAmbientes(data);
        } else {
          setAmbientes([]);
        }
      } catch (error) {
        console.error("Error al cargar los ambientes:", error);
        setAmbientes([]);
      }
    };

    fetchAmbientes();
  }, []);

  // Actualiza la vista previa de la imagen cuando se selecciona un archivo
  useEffect(() => {
    if (watchFoto && watchFoto[0]) {
      const file = watchFoto[0];
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  }, [watchFoto]);

  const openModal = (data) => {
    setFormData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(null);
  };

  const onSubmit = async () => {
    try {
      const submissionData = new FormData();
      submissionData.append("descripcion", formData.descripcion);
      submissionData.append("telefono", formData.telefono);
      submissionData.append("ambiente", formData.ambiente);
      submissionData.append("foto", formData.foto[0]);

      const response = await crearSolicitud(submissionData);
      console.log("Solicitud enviada con éxito:", response);
      toast.success("La solicitud ha sido realizada.");
      reset(); // Limpia el formulario después de enviarlo
      closeModal(); // Cierra el modal después de enviar
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un error al realizar la solicitud.");
      closeModal(); // Cierra el modal si ocurre un error
    }
  };

  // Abrir modal de imagen ampliada
  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  // Cerrar modal de imagen ampliada
  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <AppLayout>
      <main className="w-full flex justify-center">
      <div className="w-full max-w-[90%] pl-4  flex gap-8 py-8">
        <div className="w-full max-w-[20%] p-4 border rounded-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Crear Solicitud
          </h2>
          <form
            onSubmit={handleSubmit(openModal)}
            className="flex flex-col space-y-4"
          >
            <textarea
              className="p-3 border border-gray-300 rounded focus:outline-none"
              placeholder="Descripción"
              {...register("descripcion")}
            ></textarea>
            <input
              type="tel"
              placeholder="Teléfono"
              className="p-3 border border-gray-300 rounded focus:outline-none"
              {...register("telefono")}
            />
            <select
              className="p-3 border border-gray-300 rounded focus:outline-none"
              {...register("ambiente")}
            >
              <option value="">Ambiente de formación</option>
              {ambientes.map((amb) => (
                <option key={amb._id} value={amb._id}>
                  {amb.nombre}
                </option>
              ))}
            </select>
            <div className=" flex items-center mt-3 justify-between">
              <div className="flex gap-4">
                <label className="cursor-pointer bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center">
                  Agregar Foto
                  <input
                    type="file"
                    className="hidden"
                    {...register("foto")}
                    accept="image/*"
                  />
                </label>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Vista previa"
                    className="w-12 h-12 object-cover rounded cursor-pointer"
                    onClick={openImageModal} // Evento onClick para abrir modal
                  />
                )}
              </div>

              <button
                type="submit"
                className="bg-azul-sena text-white py-2 px-4 rounded"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
        <div className="w-full">
          <h3 className="text-lg font-semibold">Historial de solicitudes creadas</h3>
          <HistorialFuncionario/>
        </div>
      </div>
      </main>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-bold mb-4">
              ¿Estás seguro de enviar esta solicitud?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Editar
              </button>
              <button
                onClick={onSubmit}
                className="px-4 py-2 bg-azul-sena text-white rounded"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal para la imagen expandida */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50"
          onClick={closeImageModal} // Cierra el modal cuando se haga clic fuera de la imagen
        >
          <img
            src={previewImage}
            alt="Vista previa ampliada"
            className="max-w-full max-h-full rounded"
            onClick={(e) => e.stopPropagation()} // Evita que el clic en la imagen cierre el modal
          />
        </div>
      )}
    </AppLayout>
  );
}
