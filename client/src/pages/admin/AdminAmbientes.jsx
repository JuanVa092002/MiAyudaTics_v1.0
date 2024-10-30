import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/appLayout/AppLayout";
import AdminLayout from "../../layouts/adminLayout/AdminLayout";
import {
  getAmbientes,
  createAmbiente,
  updateAmbiente,
  inactivarAmbiente,
} from "../../services/ambiente.services";

export default function AdminAmbientes() {
  const [ambientes, setAmbientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentAmbienteId, setCurrentAmbienteId] = useState(null);

  useEffect(() => {
    loadAmbientes();
  }, []);

  const loadAmbientes = async () => {
    try {
      const data = await getAmbientes();
      setAmbientes(data.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editMode) {
        await updateAmbiente(currentAmbienteId, { nombre });
      } else {
        await createAmbiente({ nombre });
      }
      setNombre("");
      setEditMode(false);
      loadAmbientes();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEdit = (ambiente) => {
    setNombre(ambiente.nombre);
    setCurrentAmbienteId(ambiente._id);
    setEditMode(true);
  };

  const handleInactivar = async (id) => {
    try {
      await inactivarAmbiente(id);
      loadAmbientes();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <AppLayout>
      <AdminLayout>
        <div className="pl-8 py-8  rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Administrar Ambientes de Formación
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateOrUpdate();
            }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-6 pr-4"
          >
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del ambiente"
              required
              className="w-full sm:w-auto flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-verde-sena text-gray-200 rounded-lg hover:text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:bg-azul-sena"
            >
              {editMode ? "Actualizar" : "Crear"} Ambiente
            </button>
          </form>

          <ul className="space-y-4">
            {ambientes.map((ambiente) => (
              <li
                key={ambiente._id}
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm"
              >
                <span className="text-gray-700">{ambiente.nombre}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(ambiente)}
                    className="px-3 py-1 bg-azul-sena text-gray-200 rounded-lg hover:text-white"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleInactivar(ambiente._id)}
                    className="px-3 py-1 bg-gray-500 text-gray-200 rounded-lg hover:bg-gray-600 hover:text-while (condition) {
                      
                    }"
                  >
                    Inactivar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </AdminLayout>
    </AppLayout>
  );
}
