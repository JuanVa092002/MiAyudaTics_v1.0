import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { asignarSolicitudTecnico } from "../../services/solicitud.services";
import { getSolicitudesPendientes } from "../../services/solicitudList.services";
import { getTecnicosAprobados } from "../../services/tecnicos.services";
import AppLayout from "../../layouts/appLayout/AppLayout";
import AdminLayout from "../../layouts/adminLayout/AdminLayout";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import AdminSolicitudLayout from "../../layouts/adminLayout/AdminSolicitudLayout";

export default function AdminSolicitud() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tecnicos, setTecnicos] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSolicitudes() {
      try {
        const data = await getSolicitudesPendientes();
        const sortedData = data.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setSolicitudes(sortedData);
      } catch (error) {
        console.error("Error al cargar solicitudes:", error);
      }finally {
        setLoading(false);
      }
    }
    fetchSolicitudes();
  }, []);

  const handleShareClick = async (solicitud) => {
    setSelectedSolicitud(solicitud);
    try {
      const response = await getTecnicosAprobados();
      const tecnicosAprobados = response.tecnicos;
      setTecnicos(tecnicosAprobados);
      setShowModal(true);
    } catch (error) {
      console.error("Error al cargar técnicos aprobados:", error);
    }
  };

  const handleAssignClick = async (tecnicoId) => {
    if (!selectedSolicitud || !tecnicoId) return;
    try {
      // Asignar la solicitud al técnico
      await asignarSolicitudTecnico(selectedSolicitud._id, {
        tecnico: tecnicoId._id,
      });
  
      // Mostrar mensaje de éxito
      toast.success("Solicitud asignada con éxito");
  
      // Filtrar la solicitud asignada fuera del estado de solicitudes
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.filter(
          (solicitud) => solicitud._id !== selectedSolicitud._id
        )
      );
  
      // Cerrar el modal
      setShowModal(false);
    } catch (error) {
      toast.error("Error al asignar la solicitud");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const paginationOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };
  const modalColumns = [
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
      name: "TELÉFONO",
      selector: (row) => row.telefono,
      sortable: true,
    },
    {
      name: "ASIGNAR",
      cell: (row) => (
        <button
          className="bg-azul-sena text-white px-2 py-1 rounded-lg hover:bg-verde-sena"
          onClick={() => handleAssignClick(row)}
        >
          Asignar
        </button>
      ),
      //center: true,
    },
  ];

  const columns = [
    {
      name: "FECHA",
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: "AMBIENTE",
      selector: (row) => row.ambiente?.nombre || "No disponible",
    },
    {
      name: "DESCRIPCIÓN",
      selector: (row) => row.descripcion,
    },
    {
      name: "USUARIO",
      selector: (row) => row.usuario?.nombre || "Sin usuario",
    },
    {
      name: "IMAGEN",
      cell: (row) =>
        row.foto ? (
          <a
            href={row.foto.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Ver Foto
          </a>
        ) : (
          "No disponible"
        ),
    },
    {
      name: "ASIGNAR",
      cell: (row) => (
        <FontAwesomeIcon
          icon={faShare}
          className="text-verde-sena text-lg cursor-pointer hover:text-green-700"
          onClick={() => handleShareClick(row)}
        />
      ),
      //center: true,
    },
  ];

  return (
    <AppLayout>
      <AdminLayout>
        <AdminSolicitudLayout>
        <main className="pl-8 py-8">
          <h2 className="text-xl font-bold mb-4">Gestion solicitudes</h2>

          <DataTable
            columns={columns}
            data={solicitudes}
            progressPending={loading}
            pagination
            paginationComponentOptions={paginationOptions}
            noDataComponent="No hay solicitudes por resolver"
            highlightOnHover
            striped
          />
        </main>

        {showModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50 overflow-y-auto">
            <div className="bg-white w-full max-w-[50%] p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center pb-4">
                <h2 className="text-xl font-bold">Asignar Técnico</h2>
                <button
                  className="bg-gray-500 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 hover:text-white ml-4"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
              <DataTable
                columns={modalColumns}
                data={tecnicos}
                pagination
                paginationComponentOptions={paginationOptions}
                highlightOnHover
                striped
                className="min-w-full border border-gray-300 rounded-lg "
              />
            </div>
          </div>
        )}
        </AdminSolicitudLayout>
      </AdminLayout>
    </AppLayout>
  );
}
