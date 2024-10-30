import React, { useEffect, useState } from "react";
import AppLayout from "../../../layouts/appLayout/AppLayout";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import DataTable from "react-data-table-component";
import { getTecnicosActivos, inactivarTecnico } from "../../../services/tecnicos.services";
import { toast } from "react-toastify";  // Si ya tienes Toastify configurado
import AdminTecnicosLayout from "../../../layouts/adminLayout/AdminTecnicosLayout";

export default function TecnicosActivos() {
  const [tecnicosActivos, setTecnicosActivos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar técnicos activos al montar el componente
  useEffect(() => {
    const cargarTecnicosActivos = async () => {
      try {
        const data = await getTecnicosActivos();
        setTecnicosActivos(data);  // Aquí se asignan correctamente los datos al estado
      } catch (error) {
        console.error("Error al cargar técnicos activos:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarTecnicosActivos();
  }, []);

  // Inactivar técnico
  const handleInactivar = async (id) => {
    try {
      await inactivarTecnico(id);
      toast.success("Técnico inactivado exitosamente");  // Mostrar mensaje con Toastify
      setTecnicosActivos(prevState => prevState.filter(tecnico => tecnico._id !== id));  // Remover técnico inactivado de la lista
    } catch (error) {
      toast.error("Error al inactivar técnico");
      console.error("Error al inactivar técnico:", error);
    }
  };
  const paginationOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };
  // Columnas para la tabla
  const columnas = [
    {
      name: "Nombre",
      selector: row => row.nombre,
      sortable: true,
    },
    {
      name: "Correo",
      selector: row => row.correo,
    },
    {
      name: "Teléfono",
      selector: row => row.telefono,
    },
    {
      name: "Acciones",
      cell: row => (
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleInactivar(row._id)}
        >
          Inactivar
        </button>
      ),
    },
  ];

  return (
    <AppLayout>
      <AdminLayout>
        <AdminTecnicosLayout>
          <main className="pl-8 py-8">
            <h2 className="text-xl font-bold mb-4">Técnicos Activos</h2>
            <div className="rounded-lg shadow-lg">
              <DataTable
                columns={columnas}
                data={tecnicosActivos}
                pagination
                highlightOnHover
                striped
                progressPending={loading}
                paginationComponentOptions={paginationOptions}
                noDataComponent="No hay técnicos activos disponibles"
                className="min-w-full border border-gray-300 rounded-lg"
              />
            </div>
          </main>
        </AdminTecnicosLayout>
      </AdminLayout>
    </AppLayout>
  );
}
