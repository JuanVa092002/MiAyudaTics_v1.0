import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/appLayout/AppLayout';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import { getCasos, createCaso, updateCaso } from '../../services/caso.services';
import { toast } from 'react-toastify';

export default function AdminCasos() {
  const [casos, setCasos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editCasoId, setEditCasoId] = useState(null);

  useEffect(() => {
    // Cargar los casos al montar el componente
    loadCasos();
  }, []);

  const loadCasos = async () => {
    try {
      const response = await getCasos();
      setCasos(response.data);
    } catch (error) {
      console.error('Error al obtener los tipos de casos', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoCaso = { nombre, descripcion };
    
    try {
      if (editMode) {
        // Editar el caso existente
        await updateCaso(editCasoId, nuevoCaso);
        toast.success('Tipo de caso actualizado exitosamente');
      } else {
        // Crear un nuevo caso
        await createCaso(nuevoCaso);
        toast.success('Tipo de caso creado exitosamente');
      }
      resetForm();
      loadCasos(); // Recargar la lista de casos
    } catch (error) {
      console.error('Error al crear/actualizar tipo de caso', error);
    }
  };

  const handleEdit = (caso) => {
    setEditMode(true);
    setEditCasoId(caso._id);
    setNombre(caso.nombre);
    setDescripcion(caso.descripcion);
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setEditMode(false);
    setEditCasoId(null);
  };

  return (
    <AppLayout>
      <AdminLayout>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Administrar Tipos de soporte</h2>
          
          <form onSubmit={handleSubmit} className="mb-6">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del sopprte"
              required
              className="border p-2 rounded w-full mb-4"
            />
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del soporte"
              required
              className="border p-2 rounded w-full mb-4"
            />
            <button type="submit" className="bg-verde-sena text-gray-200 px-4 py-2 rounded hover:text-white hover:bg-green-700">
              {editMode ? 'Actualizar' : 'Crear'} Soporte
            </button>
          </form>

          <ul className="space-y-4">
            {casos.map((caso) => (
              <li key={caso._id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{caso.nombre}</h3>
                  <p>{caso.descripcion}</p>
                </div>
                <button
                  className="bg-azul-sena text-gray-200 px-4 py-2 rounded hover:text-white"
                  onClick={() => handleEdit(caso)}
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </AdminLayout>
    </AppLayout>
  );
}
