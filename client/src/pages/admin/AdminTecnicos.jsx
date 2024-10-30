import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/appLayout/AppLayout";
import AdminLayout from "../../layouts/adminLayout/AdminLayout";
import {
  getTecnicosPendientes,
  aprobarTecnico,
  denegarTecnico,
} from "../../services/tecnicos.services";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import AdminTecnicosLayout from "../../layouts/adminLayout/AdminTecnicosLayout";

export default function AdminTecnicos() {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const { tecnicosFalse } = await getTecnicosPendientes();
        setTecnicos(tecnicosFalse);   
      } catch (error) {
        console.error("Error al obtener técnicos pendientes:", error);
      }finally {
        setLoading(false);
      }
      
    };

    fetchTecnicos();
  }, []);

  const handleAprobar = async (id) => {
    try {
      await aprobarTecnico(id);
      setTecnicos(tecnicos.filter((tecnico) => tecnico._id !== id));
      toast.success("Técnico aprobado exitosamente.");
    } catch (error) {
      console.error("Error al aprobar técnico:", error);
      toast.error("Hubo un error al aprobar el técnico.");
    }
  };

  const handleDenegar = async (id) => {
    try {
      await denegarTecnico(id);
      setTecnicos(tecnicos.filter((tecnico) => tecnico._id !== id));
      toast.success("Técnico denegado exitosamente.");
    } catch (error) {
      console.error("Error al denegar técnico:", error);
      toast.error("Hubo un error al denegar el técnico.");
    }
  };

  const paginationOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  const tecnicosColumns = [
    {
      name: "NOMBRE",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "CORREO",
      selector: (row) => row.correo,
      sortable: true,
    },
    {
      name: "TELEFONO",
      selector: (row) => row.telefono,
      sortable: true,
    },
    {
      name: "ESTADO",
      selector: (row) => (row.estado ? "Aprovado" : "Pendiente"),
      sortable: true,
    },
    {
      name: "OPCIONES",
      cell: (row) => (
        <>
          <button
            className="bg-green-500 text-white py-1 px-2 rounded mr-2 hover:bg-green-600"
            onClick={() => handleAprobar(row._id)}
          >
            Aprobar
          </button>
          <button
            className="bg-gray-500 text-gray-200 py-1 px-2 rounded hover:bg-gray-600 hover:text-white"
            onClick={() => handleDenegar(row._id)}
          >
            Denegar
          </button>
        </>
      ),
    },
  ];

  return (
    <AppLayout>
      <AdminLayout>
        <AdminTecnicosLayout>
          <main className="pl-8 py-8">
            <h2 className="text-xl font-bold mb-4">Tecnicos por aprobar</h2>
            <div className="rounded-lg shadow-lg">
              <DataTable
                columns={tecnicosColumns}
                data={tecnicos}
                pagination
                progressPending={loading}
                paginationComponentOptions={paginationOptions}
                highlightOnHover
                striped
                className="min-w-full border border-gray-300 rounded-lg "
                noDataComponent="No hay técnicos por aprobar"

              />
            </div>
          </main>
        </AdminTecnicosLayout>
      </AdminLayout>
    </AppLayout>
  );
}
