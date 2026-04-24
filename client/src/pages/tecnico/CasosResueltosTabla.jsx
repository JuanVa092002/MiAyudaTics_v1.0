import React, { useState, useEffect } from 'react'
import axiosConfig from '@/services/axios'
import AppLayout from '@/layouts/appLayout/AppLayout'
import TecnicoLayout from '@/layouts/tecnicoLayout/TecnicoLayout'

const CasosResueltosTabla = () => {
  const [cases, setCases] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchCases = async () => {
      try {
        // Mantener alineado con el resto del frontend: axiosConfig + token (localStorage/cookie)
        const tokenFromStorage = localStorage.getItem('token')
        const tokenFromCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1]
        const token = tokenFromStorage || tokenFromCookie

        const response = await axiosConfig.get('/solicitud/finalizadas', token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined
        )

        if (response.data && response.data.solicitudesFinalizadas) {
          setCases(response.data.solicitudesFinalizadas)
        }
      } catch (error) {
        console.error('Error al obtener los casos resueltos:', error.response || error)
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [])

  const filteredData = cases.filter(c =>
    (c.codigoCaso || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.usuario?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.solucion?.descripcionSolucion || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <AppLayout>
      <TecnicoLayout>
        <main className="p-8 animate-in fade-in duration-700">
          <section className="premium-card rounded-3xl overflow-hidden flex flex-col h-full shadow-xl">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b hairline-border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-on-surface tracking-tight">Historial de Resoluciones</h2>
                <p className="text-sm text-on-surface-variant font-medium mt-1">Bitácora técnica de soluciones aplicadas y conocimiento consolidado.</p>
              </div>
              <div className="relative w-full sm:w-80 group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[18px]">search</span>
                <input 
                  className="w-full pl-11 pr-4 py-3 solid-input rounded-2xl text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/10 transition-all shadow-sm" 
                  placeholder="Buscar en el historial de soluciones..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="premium-table-container max-h-[calc(100vh-320px)]">
              <table className="premium-table">
                <thead className="premium-thead">
                  <tr>
                    <th className="premium-th min-w-[140px]">Resolución</th>
                    <th className="premium-th min-w-[150px]">Ambiente</th>
                    <th className="premium-th min-w-[300px]">Problema Reportado</th>
                    <th className="premium-th min-w-[300px]">Solución Técnica</th>
                    <th className="premium-th text-center w-[120px]">Evidencias</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {loading ? (
                    <tr><td colSpan="5" className="py-20 text-center"><span className="animate-pulse font-bold text-slate-300 uppercase tracking-widest">Consultando bitácora...</span></td></tr>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((row) => (
                      <tr key={row._id} className="premium-tr group/row">
                        <td className="premium-td">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-[13px] font-bold text-emerald-600">
                              <span className="material-symbols-outlined !text-[16px] font-variation-['FILL'_1]">task_alt</span>
                              {row.fecha}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-6">Ref: {row.codigoCaso || row._id.slice(-6)}</span>
                          </div>
                        </td>
                        <td className="premium-td">
                           <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2 text-[13px] font-semibold text-on-surface">
                                <span className="material-symbols-outlined !text-[18px] text-slate-400">location_on</span>
                                {row.ambiente?.nombre || 'General'}
                              </div>
                              <span className="text-[11px] font-medium text-slate-400 italic pl-6">{row.usuario?.nombre}</span>
                           </div>
                        </td>
                        <td className="premium-td">
                          <p className="text-[13px] font-medium text-on-surface leading-relaxed line-clamp-2 italic text-slate-500 border-l-2 border-slate-100 pl-3">
                            "{row.descripcion}"
                          </p>
                        </td>
                        <td className="premium-td">
                          <div className="p-3 rounded-xl bg-emerald-50/30 border border-emerald-100/50 group-hover/row:bg-emerald-50 transition-colors">
                            <p className="text-[13px] font-semibold text-emerald-900 leading-relaxed">
                              {row.solucion?.descripcionSolucion || 'Solución documentada'}
                            </p>
                          </div>
                        </td>
                        <td className="premium-td text-center">
                          <div className="flex items-center justify-center gap-2">
                             {row.foto && (
                               <a href={row.foto.url} target="_blank" rel="noreferrer" title="Ver problema" className="w-9 h-9 rounded-lg bg-slate-50 border hairline-border border-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                                 <span className="material-symbols-outlined text-slate-400 !text-[18px]">visibility</span>
                               </a>
                             )}
                             {row.solucion?.evidencia && (
                               <a href={row.solucion.evidencia.url} target="_blank" rel="noreferrer" title="Ver resolución" className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 group/link transition-all">
                                 <span className="material-symbols-outlined text-emerald-700 group-hover/link:text-white !text-[18px] font-variation-['FILL'_1]">verified</span>
                               </a>
                             )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                          <span className="material-symbols-outlined !text-[64px]">history</span>
                          <p className="text-sm font-black uppercase tracking-[0.2em]">No hay registros en el historial</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="pagination-footer">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Histórico — Página {currentPage}</span>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{totalItems} casos resueltos</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="pagination-btn">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="pagination-btn">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      </TecnicoLayout>
    </AppLayout>
  )
}

export default CasosResueltosTabla

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import DataTable from 'react-data-table-component';
// import AppLayout from '@/layouts/appLayout/AppLayout';
// import TecnicoLayout from '@/layouts/tecnicoLayout/TecnicoLayout';

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
