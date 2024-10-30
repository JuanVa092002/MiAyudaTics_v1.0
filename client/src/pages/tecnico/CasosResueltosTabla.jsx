import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import AppLayout from '../../layouts/appLayout/AppLayout';
import TecnicoLayout from '../../layouts/tecnicoLayout/TecnicoLayout';
// import ReactToPrint from 'react-to-print'; 

const CasosResueltosTabla = () => {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const printRef = useRef();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
        const response = await axios.get('http://localhost:3010/api/solicitud/finalizadas', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        console.log('Respuesta de la API:', response.data); 
  
        if (response.data && response.data.solicitudesFinalizadas) {
          setCases(response.data.solicitudesFinalizadas);
        } else {
          console.error('No se encontraron solicitudes asignadas.');
        }
      } catch (error) {
        console.error('Error al obtener los casos resueltos:', error.response || error);
      }
    };
  
    fetchCases();
  }, []);
  

  const filteredCases = cases.filter(c =>
    c.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const columns = [
  //   {
  //     name: 'Código del Caso',
  //     selector: row => row.codigoCaso,
  //     cell: row => (
  //       <div className="break-words overflow-hidden max-w-xs">{row.codigoCaso || 'No disponible'}</div>
  //     ),
  //   },
  //   {
  //     name: 'Descripción',
  //     selector: row => row.descripcion,
  //     cell: row => (
  //       <div className="break-words overflow-hidden max-w-xs">{row.descripcion || 'No disponible'}</div>
  //     ),
  //   },
  //   {
  //     name: 'Fecha de Resolución',
  //     selector: row => row.fecha, // Asegúrate de que 'createdAt' sea el campo correcto para la fecha de resolución
  //     cell: row => (
  //       <div className="break-words overflow-hidden max-w-xs">{row.fecha || 'No disponible'}</div>
  //     ),
  //   },
  //   {
  //     name: 'Solución',
  //     selector: row => row.solucion.descripcionSolucion,
  //     cell: row => (
  //       <div className="break-words overflow-hidden max-w-xs">
  //         {row.solucion.descripcionSolucion ? row.solucion.descripcionSolucion : 'No disponible'}
  //       </div>
  //     ),
  //     width: '200px', 
  //   },
  //   {
  //     name: 'Evidencia',
  //     cell: (row) =>
  //       row.solucion.evidencia ? (
  //         <a
  //           href={row.solucion.evidencia.url}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="text-blue-500 hover:underline break-words overflow-hidden max-w-xs"
  //         >
  //           Ver Foto
  //         </a>
  //       ) : (
  //         <div className="break-words overflow-hidden max-w-xs">Sin Evidencia</div>
  //       ),
  //   },
    
  // ];
  
  const columns = [
    {
      name: 'Código del Caso',
      selector: row => row.codigoCaso,
      cell: row => (
        <div className="break-words overflow-hidden max-w-xs">{row.codigoCaso || 'No disponible'}</div>
      ),
    },
    {
      name: 'Foto del Caso',
      cell: row =>
        row.foto && row.foto.url ? (
          <a
            href={row.foto.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline break-words overflow-hidden max-w-xs"
          >
            Ver Foto del Caso
          </a>
        ) : (
          <div className="break-words overflow-hidden max-w-xs">Sin Foto</div>
        ),
    },
    {
      name: 'Descripción',
      selector: row => row.descripcion,
      cell: row => (
        <div className="break-words overflow-hidden max-w-xs">{row.descripcion || 'No disponible'}</div>
      ),
    },
    {
      name: (
        <div className="whitespace-normal">Fecha de Resolución</div>),
      selector: row => row.fecha, // Asegúrate de que 'fecha' sea el campo correcto
      cell: row => (
        <div className="break-words overflow-hidden max-w-xs">{row.fecha || 'No disponible'}</div>
      ),
    },
    {
      name: 'Usuario',
      selector: row => row.usuario ? row.usuario.nombre : 'No disponible',
      cell: row => (
        <div className="break-words overflow-hidden max-w-xs">{row.usuario ? row.usuario.nombre : 'No disponible'}</div>
      ),
    },
    
    {
      name: 'Ambiente',
      selector: row => row.ambiente.nombre, // Accede al nombre del ambiente (populate)
      cell: row => (
        <div className="break-words overflow-hidden max-w-xs">{row.ambiente.nombre || 'No disponible'}</div>
      ),
    },
    {
      name: 'Solución',
      selector: row => row.solucion.descripcionSolucion,
      cell: row => (
        <div className="break-words overflow-hidden max-w-xs">
          {row.solucion.descripcionSolucion ? row.solucion.descripcionSolucion : 'No disponible'}
        </div>
      ),
      width: '200px', 
    },

  ];
  

  

  return (
    <AppLayout>
    <TecnicoLayout>
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Casos Resueltos</h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar por descripción..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Si decides usar la funcionalidad de impresión
        <ReactToPrint
          trigger={() => (
            <button className="btn bg-red-500 text-white hover:bg-red-600 hover:shadow-lg transition ease-in-out duration-150 ml-4">
              Descargar PDF
            </button>
          )}
          content={() => printRef.current}
        />
        */}
      </div>

      <div>
        <DataTable
          columns={columns}
          data={filteredCases} 
          pagination
          responsive
        />
      </div>
    </div>
    </TecnicoLayout>
    </AppLayout>
  );
};

export default CasosResueltosTabla;







// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import DataTable from 'react-data-table-component';
// import AppLayout from '../../layouts/appLayout/AppLayout';
// import TecnicoLayout from '../../layouts/tecnicoLayout/TecnicoLayout';

// const CasosResueltosTabla = () => {
//   const [cases, setCases] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const printRef = useRef();

//   useEffect(() => {
//     const fetchCases = async () => {
//       try {
//         const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
//         const response = await axios.get('http://localhost:3010/api/solicitud/finalizadas', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         console.log('Respuesta de la API:', response.data); // Para depurar la respuesta de la API

//         if (response.data && response.data.solicitudesFinalizadas) {
//           setCases(response.data.solicitudesFinalizadas);
//         } else {
//           console.error('No se encontraron solicitudes asignadas.');
//         }
//       } catch (error) {
//         console.error('Error al obtener los casos resueltos:', error.response || error);
//       }
//     };

//     fetchCases();
//   }, []);

//   const filteredCases = cases.filter(c =>
//     c.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const columns = [
//     { name: 'Código del Caso', selector: row => row.codigoCaso },
//     { name: 'Descripción', selector: row => row.descripcion },
//     { name: 'Fecha de Resolución', selector: row => row.fecha }, // Asegúrate de que 'createdAt' sea el campo correcto para la fecha de resolución
//     {
//       name: 'Solución',
//       selector: row => row.descripcionSolucion || 'No disponible',
//       width: '200px' // Establece el ancho aquí también
//     },
//     {
//       name: 'Evidencia',
//       cell: row => (
//         row.evidencia ? (
//           <a href={row.evidencia.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
//             Ver Evidencia
//           </a>
//         ) : (
//           'Sin evidencia'
//         )
//       ),
//     },
//   ];

//   return (
//     <AppLayout>
//       <TecnicoLayout>
//         <div className="p-4">
//           <h1 className="text-2xl font-semibold mb-4">Casos Resueltos</h1>

//           <div className="flex justify-between mb-4">
//             <input
//               type="text"
//               placeholder="Buscar por descripción..."
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div>
//             <DataTable
//               columns={columns}
//               data={filteredCases} // Aquí se usa el filtro de búsqueda
//               pagination
//               responsive
//             />
//           </div>
//         </div>
//       </TecnicoLayout>
//     </AppLayout>
//   );
// };

// export default CasosResueltosTabla;

