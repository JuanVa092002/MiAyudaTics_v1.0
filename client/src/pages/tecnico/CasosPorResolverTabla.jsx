import React, { useState, useEffect } from 'react'
import axiosConfig from '@/services/axios'
import AppLayout from '@/layouts/appLayout/AppLayout'
import TecnicoLayout from '@/layouts/tecnicoLayout/TecnicoLayout'
import SolutionModal from './modal'

const CasosPorResolverTabla = () => {
  const [cases, setCases] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState(null)
  const [caseTypes, setCaseTypes] = useState([])

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axiosConfig.get('/solicitud/asignadas')
        const solicitudesAsignadas = Array.isArray(response?.data?.solicitudesAsignadas)
          ? response.data.solicitudesAsignadas
          : []
        const filteredCases = solicitudesAsignadas.filter(
          c => c.estado !== 'finalizado'
        )
        setCases(filteredCases)
      } catch (error) {
        console.error('Error al obtener los casos:', error.response?.data || error.message)
      }
    }

    const fetchCaseTypes = async () => {
      try {
        const response = await axiosConfig.get('/tipoCaso')

        const caseTypesData = response.data.data
        if (Array.isArray(caseTypesData)) {
          setCaseTypes(caseTypesData)
        }
      } catch (error) {
        console.error('Error al obtener los tipos de caso:', error.response?.data || error.message)
      }
    }

    fetchCases()
    fetchCaseTypes()
  }, [])

  // Search and Pagination Logic
  const filteredData = cases.filter(row =>
    (row.codigoCaso || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (row.usuario?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'solicitado':
        return <span className="badge-base bg-blue-50 text-blue-700 border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>Pendiente
        </span>
      case 'asignado':
        return <span className="badge-base bg-amber-50 text-amber-700 border-amber-100">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>Asignado
        </span>
      case 'pendiente':
        return <span className="badge-base bg-orange-50 text-orange-700 border-orange-100">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>En Proceso
        </span>
      default:
        return <span className="badge-base bg-slate-100 text-slate-600 border-slate-200 uppercase">{estado}</span>
    }
  }

  const openModal = caseData => {
    setSelectedCase(caseData)
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const handleSubmit = async () => {
    try {
      if (!selectedCase) return
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        .split('=')[1]

      const updatedCase = {
        descripcionSolucion: selectedCase.solucion,
        tipoCaso: selectedCase._id,
        tipoSolucion: selectedCase.tipoSolucion,
      }

      if (!updatedCase.descripcionSolucion || !updatedCase.tipoCaso || !updatedCase.tipoSolucion) {
        alert('Por favor completa todos los campos antes de enviar.')
        return
      }

      await axiosConfig.post(
        `/solucionCaso/${selectedCase._id}`,
        updatedCase,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (updatedCase.tipoSolucion === 'finalizado') {
        setCases(cases.filter(c => c._id !== selectedCase._id))
      }
      closeModal()
    } catch (error) {
      console.error('Error al actualizar el caso:', error)
    }
  }

  return (
    <AppLayout>
      <TecnicoLayout>
        <main className="py-4 sm:py-6 lg:py-8 px-3 animate-in fade-in duration-500">
          <section className="premium-card rounded-3xl overflow-hidden flex flex-col h-full w-[min(96vw,1560px)] ml-auto mr-auto xl:ml-[clamp(24px,4vw,72px)] xl:mr-auto animate-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b hairline-border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white">
            <div>
              <h2 className="text-xl font-bold text-on-surface">Casos por Resolver</h2>
              <p className="text-sm text-on-surface-variant font-medium mt-1">Gestión operativa y resolución técnica de solicitudes.</p>
            </div>
            <div className="relative w-full sm:w-80 lg:w-96 group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[18px] group-focus-within:text-primary-container transition-colors">search</span>
              <input 
                className="w-full pl-11 pr-4 py-2.5 solid-input rounded-2xl text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/10 transition-all" 
                placeholder="Buscar por código, usuario o detalle..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="premium-table-container max-h-[calc(100vh-350px)]">
            <table className="premium-table">
              <thead className="premium-thead">
                <tr>
                  <th className="premium-th min-w-[120px]">Ticket</th>
                  <th className="premium-th min-w-[130px]">Fecha</th>
                  <th className="premium-th min-w-[150px]">Ubicación</th>
                  <th className="premium-th min-w-[200px]">Usuario / Contacto</th>
                  <th className="premium-th min-w-[300px]">Detalle del Problema</th>
                  <th className="premium-th text-center w-[80px]">Evidencia</th>
                  <th className="premium-th min-w-[140px]">Estado</th>
                  <th className="premium-th text-center w-[120px] min-w-[110px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((row) => (
                    <tr key={row._id} className="premium-tr group">
                      <td className="premium-td">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined !text-[16px] text-primary-container/40 font-variation-['wght'_300]">confirmation_number</span>
                            <span className="text-[13px] font-bold text-primary-container leading-none">#{row.codigoCaso || row._id?.slice(-6) || 'N/A'}</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-6">ID Interno</span>
                        </div>
                      </td>
                      <td className="premium-td">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-[13px] font-semibold text-on-surface">
                            <span className="material-symbols-outlined !text-[16px] text-slate-300">calendar_today</span>
                            {row.fecha}
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-6">Reportado</span>
                        </div>
                      </td>
                      <td className="premium-td">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-[13px] font-medium text-on-surface leading-snug">
                            <span className="material-symbols-outlined !text-[18px] text-emerald-500 font-variation-['FILL'_1]">location_on</span>
                            {row.ambiente?.nombre || 'General'}
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-6">Sede / Ambiente</span>
                        </div>
                      </td>
                      <td className="premium-td">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined !text-[14px] text-slate-500">person</span>
                            </div>
                            <span className="text-[13px] font-bold text-on-surface truncate max-w-[150px]">{row.usuario?.nombre || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 pl-8">
                             <span className="material-symbols-outlined !text-[12px] text-slate-300">phone</span>
                             <span className="text-[11px] font-medium text-slate-400 italic">{row.telefono || 'Sin tel'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="premium-td">
                        <p className="text-[13px] font-medium text-on-surface leading-relaxed line-clamp-3">
                          {row.descripcion}
                        </p>
                      </td>
                      <td className="premium-td text-center">
                        {row.foto ? (
                          <a href={row.foto.url} target="_blank" rel="noreferrer" className="inline-flex flex-col items-center gap-1 group/thumb">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border hairline-border border-slate-200 group-hover/thumb:border-primary-container transition-all shadow-sm">
                              <img src={row.foto.url} alt="Evidencia" className="w-full h-full object-cover" />
                            </div>
                          </a>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-dashed border-slate-200 mx-auto">
                            <span className="material-symbols-outlined text-slate-300 text-[18px]">image_not_supported</span>
                          </div>
                        )}
                      </td>
                      <td className="premium-td">
                        {getStatusBadge(row.estado)}
                      </td>
                      <td className="premium-td align-middle">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => openModal(row)}
                            className="inline-flex items-center justify-center px-3.5 py-2 rounded-xl bg-primary-container text-white text-xs font-bold uppercase tracking-[0.12em] leading-none hover:bg-primary transition-all shadow-sm active:scale-95"
                          >
                            Resolver
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <span className="material-symbols-outlined !text-[64px]">rule_folder</span>
                        <p className="text-sm font-black uppercase tracking-[0.2em]">Todo despejado por aquí</p>
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Página {currentPage} de {totalPages || 1}</span>
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{totalItems} casos asignados</span>
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

        {selectedCase && (
          <SolutionModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            onSubmit={handleSubmit}
            solutionDescription={selectedCase.solucion}
            setSolutionDescription={value => setSelectedCase({ ...selectedCase, solucion: value })}
            caseType={selectedCase.tipoCaso}
            setCaseType={value => setSelectedCase({ ...selectedCase, tipoCaso: value })}
            solutionType={selectedCase.tipoSolucion}
            setSolutionType={value => setSelectedCase({ ...selectedCase, tipoSolucion: value })}
            caseTypes={caseTypes}
          />
        )}
      </TecnicoLayout>
    </AppLayout>
  )
}

export default CasosPorResolverTabla
