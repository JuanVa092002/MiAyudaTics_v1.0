import React, { useEffect, useState } from "react";
import AppLayout from "../../../layouts/appLayout/AppLayout";
import AdminLayout from "../../../layouts/adminLayout/AdminLayout";
import DataTable from "react-data-table-component";
import { getTecnicosInactivos, reactivarTecnico } from "../../../services/tecnicos.services";
import { toast } from "react-toastify";
import AdminTecnicosLayout from "../../../layouts/adminLayout/AdminTecnicosLayout";

export default function TecnicosInactivos() {
  const [tecnicosInactivos, setTecnicosInactivos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarTecnicosInactivos = async () => {
      try {
        const { data } = await getTecnicosInactivos();
        setTecnicosInactivos(data);
        console.log("Técnicos inactivos cargados:", data);  // Verificar los datos
      } catch (error) {
        console.error("Error al cargar técnicos inactivos:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarTecnicosInactivos();
  }, []);

  const handleReactivar = async (id) => {
    console.log("Reactivando técnico con ID:", id);  // Verificar el ID
    try {
      await reactivarTecnico(id);
      toast.success("Técnico reactivado exitosamente");
      setTecnicosInactivos(prevState => prevState.filter(tecnico => tecnico._id !== id));
    } catch (error) {
      toast.error("Error al reactivar técnico");
      console.error("Error al reactivar técnico:", error);
    }
  };
  const paginationOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleReactivar(row._id)}
        >
          Reactivar
        </button>
      ),
    },
  ];

  return (
    <AppLayout>
      <AdminLayout>
        <AdminTecnicosLayout>
          <main className="pl-8 py-8">
            <h2 className="text-xl font-bold mb-4">Técnicos Inactivos</h2>
            <div className="rounded-lg shadow-lg">
              <DataTable
                columns={columnas}
                data={tecnicosInactivos}
                progressPending={loading}
                pagination
                paginationComponentOptions={paginationOptions}
                highlightOnHover
                striped
                noDataComponent="No hay técnicos inactivos disponibles"
                className="min-w-full border border-gray-300 rounded-lg"
              />
            </div>
          </main>
        </AdminTecnicosLayout>
      </AdminLayout>
    </AppLayout>
  );
}
