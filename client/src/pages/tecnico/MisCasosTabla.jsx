import React, { useState, useEffect, useRef } from 'react';
import axiosConfig from '../.././services/axios';
import DataTable from 'react-data-table-component';
import AppLayout from "../../layouts/appLayout/AppLayout";
import TecnicoLayout from '../../layouts/tecnicoLayout/TecnicoLayout';

const MisCasosTabla = () => {
  const [cases, setCases] = useState([]);
  // const printRef = useRef();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
        const response = await axiosConfig.get('http://localhost:3010/api/solicitud/asignadas', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('Respuesta completa:', response.data);
        setCases(response.data.solicitudesAsignadas);
      } catch (error) {
        console.error('Error al obtener mis casos:', error.response || error);
      }
    };

    fetchCases();
  }, []);

  const columns = [
    // { name: 'Nombre', selector: row => row.usuario.nombre, sortable: true },
    { 
      name: 'Nombre', 
      selector: row => (row.usuario && row.usuario.nombre) ? row.usuario.nombre : 'Sin nombre', 
      sortable: true 
    },
    { name: 'Descripción', selector: row => row.descripcion, sortable: true },
    { name: 'Estado', selector: row => row.estado, sortable: true },
    { name: 'Fecha Creación', selector: row => new Date(row.fecha).toLocaleDateString(), sortable: true },
  ];

  return (
    <AppLayout>
      <TecnicoLayout>
        <DataTable
          columns={columns}
          data={cases}
          pagination
        />
      </TecnicoLayout>
    </AppLayout>
  );
};

export default MisCasosTabla;



// import React, { useState, useEffect } from 'react';
// import axiosConfig from '../../services/axios';
// import DataTable from 'react-data-table-component';
// import AppLayout from "../../layouts/appLayout/AppLayout";
// import TecnicoLayout from '../../layouts/tecnicoLayout/tecnicoLayout';

// const MisCasosTabla = () => {
//   const [cases, setCases] = useState([]);

//   useEffect(() => {
//     const fetchCases = async () => {
//       try {
//         const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
//         const response = await axiosConfig.get('http://localhost:3010/api/solicitud/asignadas', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         // Debugging: Muestra la respuesta completa en la consola
//         console.log('Respuesta completa:', response.data);
        
//         // Verifica que la propiedad exista y sea un array
//         if (response.data.solicitudesAsignadas && Array.isArray(response.data.solicitudesAsignadas)) {
//           console.log('Casos obtenidos:', response.data.solicitudesAsignadas);  // Muestra los casos obtenidos
//           setCases(response.data.solicitudesAsignadas);
//         } else {
//           console.error('La propiedad solicitudesAsignadas no es un array o no existe.');
//           setCases([]);
//         }
//       } catch (error) {
//         console.error('Error al obtener mis casos:', error.response?.data || error.message);
//       }
//     };

//     fetchCases();
//   }, []);

//   const columns = [
//     { name: 'Nombre', selector: row => row.usuario?.nombre || 'N/A', sortable: true },  // Protección en caso de que no haya usuario
//     { name: 'Descripción', selector: row => row.descripcion || 'N/A', sortable: true },
//     { name: 'Estado', selector: row => row.estado || 'N/A', sortable: true },
//     { name: 'Fecha Creación', selector: row => new Date(row.fecha).toLocaleDateString() || 'N/A', sortable: true },
//   ];

//   return (
//     <AppLayout>
//       <TecnicoLayout>
//         <DataTable
//           columns={columns}
//           data={cases}
//           pagination
//           noDataComponent="No hay casos disponibles"  // Mensaje cuando no hay datos
//         />
//       </TecnicoLayout>
//     </AppLayout>
//   );
// };

// export default MisCasosTabla;
