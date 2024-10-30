import React, { useEffect, useState } from 'react';
import { HistorialSolicitudesFuncionario } from '../../services/solicitud.services';
import DataTable from 'react-data-table-component';

export default function HistorialFuncionario() {
  const [historial, setHistorial] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el filtro de búsqueda

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const solicitudes = await HistorialSolicitudesFuncionario();
        setHistorial(solicitudes);
      } catch (error) {
        console.error('Error al cargar el historial:', error);
      }
    };
    fetchHistorial();
  }, []);

  const paginationOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  // Configuración de las columnas de la tabla
  const columnas = [
    {
      name: 'Código',
      selector: (row) => row.codigoCaso,
      sortable: true,
    },
    {
      name: 'Fecha',
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: 'Descripción',
      selector: (row) => row.descripcion,
      sortable: true,
    },
    {
      name: 'Ambiente',
      selector: (row) => (row.ambiente ? row.ambiente.nombre : 'N/A'),
      sortable: true,
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
      name: 'Estado',
      cell: (row) => {
        let estadoClass = '';
        let estadoTexto = row.estado;
    
        // Asignar colores según el estado
        switch (row.estado) {
          case 'solicitado':
            estadoClass = 'bg-blue-400 text-white px-2 py-1 rounded';
            break;
          case 'asignado':
            estadoClass = 'bg-yellow-400 text-white px-2 py-1 rounded';
            break;
          case 'pendiente':
            estadoClass = 'bg-orange-400 text-white px-2 py-1 rounded';
            break;
          case 'finalizado':
            estadoClass = 'bg-green-400 text-white px-2 py-1 rounded';
            break;
          default:
            estadoClass = 'bg-gray-400 text-white px-2 py-1 rounded';
        }
    
        return <span className={estadoClass}>{estadoTexto}</span>;
      },
      sortable: true,
    },
    {
      name: 'Técnico',
      selector: (row) => (row.tecnico ? row.tecnico.nombre : 'N/A'),
      sortable: true,
    },
    {
      name: 'Solución',
      selector: (row) => (row.solucion ? row.solucion.descripcionSolucion : 'N/A'),
      sortable: true,
    },
  ];

  // Filtrar los datos según el término de búsqueda
  const filteredData = historial.filter((row) =>
    row.codigoCaso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Manejar el cambio del input
          className="border p-2 rounded w-full"
        />
      </div>
      <DataTable
        columns={columnas}
        data={filteredData} // Usar los datos filtrados
        paginationComponentOptions={paginationOptions}
        pagination
        highlightOnHover
        striped
        noDataComponent="No hay solicitudes finalizadas."
        defaultSortField="codigoCaso" // Campo por el que se ordena
        defaultSortAsc={true} // Orden ascendente (de menor a mayor)
      />
    </div>
  );
}
