import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { asignarSolicitudTecnico } from '@/services/solicitud.services'
import { getSolicitudesPendientes } from '@/services/solicitudList.services'
import { getTecnicosAprobados } from '@/services/tecnicos.services'
import AppLayout from '@/layouts/appLayout/AppLayout'
import AdminLayout from '@/layouts/adminLayout/AdminLayout'
import { toast } from 'react-toastify'
import AdminSolicitudLayout from '@/layouts/adminLayout/AdminSolicitudLayout'

export default function AdminSolicitud() {
  const [solicitudes, setSolicitudes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [tecnicos, setTecnicos] = useState([])
  const [selectedSolicitud, setSelectedSolicitud] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    async function fetchSolicitudes() {
      try {
        const data = await getSolicitudesPendientes()
        const sortedData = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        setSolicitudes(sortedData)
      } catch (error) {
        console.error('Error al cargar solicitudes:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSolicitudes()
  }, [])

  const handleShareClick = async solicitud => {
    setSelectedSolicitud(solicitud)
    try {
      const response = await getTecnicosAprobados()
      const tecnicosAprobados = response.tecnicos
      setTecnicos(tecnicosAprobados)
      setShowModal(true)
    } catch (error) {
      console.error('Error al cargar técnicos aprobados:', error)
    }
  }

  const handleAssignClick = async tecnicoId => {
    if (!selectedSolicitud || !tecnicoId) return
    try {
      await asignarSolicitudTecnico(selectedSolicitud._id, {
        tecnico: tecnicoId._id,
      })
      toast.success('Solicitud asignada con éxito')
      setSolicitudes(prevSolicitudes =>
        prevSolicitudes.filter(solicitud => solicitud._id !== selectedSolicitud._id)
      )
      setShowModal(false)
    } catch (error) {
      toast.error('Error al asignar la solicitud')
    }
  }

  const filteredData = solicitudes.filter(row =>
    (row.codigoCaso || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (row.usuario?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <AppLayout>
      <AdminLayout>
        <AdminSolicitudLayout>
          <main className="p-8 animate-in fade-in duration-700">
            <section className="premium-card rounded-3xl overflow-hidden flex flex-col h-full shadow-xl">
              {/* Header */}
              <div className="p-6 sm:p-8 border-b hairline-border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white">
                <div>
                  <h2 className="text-2xl font-bold text-on-surface tracking-tight">Panel de Supervisión</h2>
                  <p className="text-sm text-on-surface-variant font-medium mt-1">Gestión global de carga operativa y asignación estratégica.</p>
                </div>
                <div className="relative w-full sm:w-80 group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[18px]">search</span>
                  <input 
                    className="w-full pl-11 pr-4 py-3 solid-input rounded-2xl text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/10 transition-all shadow-sm" 
                    placeholder="Filtrar por ticket, detalle o funcionario..." 
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
                      <th className="premium-th min-w-[140px]">Registro</th>
                      <th className="premium-th min-w-[160px]">Ambiente</th>
                      <th className="premium-th min-w-[200px]">Funcionario</th>
                      <th className="premium-th min-w-[350px]">Detalle de Solicitud</th>
                      <th className="premium-th text-center w-[100px]">Multimedia</th>
                      <th className="premium-th text-center min-w-[140px]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {loading ? (
                      <tr><td colSpan="6" className="py-20 text-center"><span className="animate-pulse font-bold text-slate-300 uppercase tracking-widest">Cargando datos...</span></td></tr>
                    ) : currentItems.length > 0 ? (
                      currentItems.map((row) => (
                        <tr key={row._id} className="premium-tr group">
                          <td className="premium-td">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2 text-[13px] font-bold text-primary-container">
                                <span className="material-symbols-outlined !text-[16px] opacity-40">event</span>
                                {row.fecha}
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-6">ID: {row.codigoCaso || row._id.slice(-6)}</span>
                            </div>
                          </td>
                          <td className="premium-td">
                             <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-[13px] font-semibold text-on-surface">
                                  <span className="material-symbols-outlined !text-[18px] text-emerald-500 font-variation-['FILL'_1]">map</span>
                                  {row.ambiente?.nombre || 'General'}
                                </div>
                             </div>
                          </td>
                          <td className="premium-td">
                            <div className="flex flex-col gap-1">
                               <span className="text-[13px] font-bold text-on-surface">{row.usuario?.nombre || 'Desconocido'}</span>
                               <span className="text-[11px] font-medium text-slate-400 italic">Reportado por funcionario</span>
                            </div>
                          </td>
                          <td className="premium-td">
                            <p className="text-[13px] font-medium text-on-surface leading-relaxed line-clamp-3 italic text-slate-600">
                              "{row.descripcion}"
                            </p>
                          </td>
                          <td className="premium-td text-center">
                            {row.foto ? (
                              <a href={row.foto.url} target="_blank" rel="noreferrer" className="inline-block p-2 rounded-xl bg-slate-50 border hairline-border border-slate-100 hover:bg-primary-container/10 transition-colors">
                                <span className="material-symbols-outlined text-primary-container !text-[20px]">image</span>
                              </a>
                            ) : (
                              <span className="material-symbols-outlined text-slate-200 !text-[20px]">image_not_supported</span>
                            )}
                          </td>
                          <td className="premium-td text-center">
                            <button 
                              onClick={() => handleShareClick(row)}
                              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95"
                            >
                              <span className="text-[11px] font-black uppercase tracking-widest">Asignar</span>
                              <span className="material-symbols-outlined !text-[16px] group-hover:rotate-12 transition-transform">person_add</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-24 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                            <span className="material-symbols-outlined !text-[64px]">verified</span>
                            <p className="text-sm font-black uppercase tracking-[0.2em]">Todas las solicitudes asignadas</p>
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Carga Actual — Página {currentPage}</span>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{totalItems} solicitudes pendientes</span>
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

          {showModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] animate-in fade-in duration-300 p-4">
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-8 border-b hairline-border border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <div>
                    <h2 className="text-xl font-bold text-on-surface">Seleccionar Técnico</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Personal calificado disponible</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <span className="material-symbols-outlined text-slate-400">close</span>
                  </button>
                </div>
                
                <div className="max-h-[400px] overflow-auto hairline-scrollbar">
                  <table className="premium-table">
                    <thead className="premium-thead">
                      <tr>
                        <th className="premium-th">Técnico / Especialista</th>
                        <th className="premium-th">Contacto</th>
                        <th className="premium-th text-right">Asignación</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {tecnicos.map((tecnico) => (
                        <tr key={tecnico._id} className="premium-tr">
                          <td className="premium-td">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center">
                                 <span className="material-symbols-outlined text-primary-container !text-[18px]">engineering</span>
                               </div>
                               <span className="text-[13px] font-bold text-on-surface">{tecnico.nombre}</span>
                             </div>
                          </td>
                          <td className="premium-td">
                             <div className="flex flex-col gap-0.5">
                               <span className="text-[12px] font-medium text-on-surface-variant truncate max-w-[180px]">{tecnico.correo}</span>
                               <span className="text-[10px] font-bold text-slate-300 italic">{tecnico.telefono}</span>
                             </div>
                          </td>
                          <td className="premium-td text-right">
                             <button 
                               onClick={() => handleAssignClick(tecnico)}
                               className="px-3 py-1.5 rounded-lg bg-primary-container text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-sm active:scale-95"
                             >
                               Elegir
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 bg-slate-50/50 border-t hairline-border border-slate-100 text-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Protocolo de asignación AyudaTIC 2026</p>
                </div>
              </div>
            </div>
          )}
        </AdminSolicitudLayout>
      </AdminLayout>
    </AppLayout>
  )
}
