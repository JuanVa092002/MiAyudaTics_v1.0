import { useState, useEffect, type ReactNode } from 'react'
import AppLayout from '@/app/layouts/AppLayout'
import TecnicoLayout from '@/app/layouts/TecnicoLayout'
import { getCasosAsignados } from '@/features/tickets'
import type { Solicitud } from '@/shared/types'

export default function MisCasosTabla(): ReactNode {
  const [cases, setCases] = useState<Solicitud[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchCases = async (): Promise<void> => {
      try {
        const solicitudes = await getCasosAsignados()
        setCases(solicitudes)
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error al obtener mis casos:', error)
        }
      } finally {
        setLoading(false)
      }
    }
    void fetchCases()
  }, [])

  const filteredData = cases.filter(c =>
    (c.codigoCaso || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof c.usuario === 'object' && c.usuario?.nombre
      ? c.usuario.nombre
      : ''
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <AppLayout>
      <TecnicoLayout>
        <main className="p-8 animate-in fade-in duration-700">
          <section className="premium-card rounded-3xl overflow-hidden flex flex-col h-full shadow-xl">
            <div className="p-6 sm:p-8 border-b hairline-border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-on-surface tracking-tight">Mis Asignaciones</h2>
                <p className="text-sm text-on-surface-variant font-medium mt-1">
                  Gestión activa de casos bajo tu responsabilidad técnica.
                </p>
              </div>
              <div className="relative w-full sm:w-80 group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[18px]">
                  search
                </span>
                <input
                  className="w-full pl-11 pr-4 py-3 solid-input rounded-2xl text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/10 transition-all shadow-sm"
                  placeholder="Buscar en mis casos activos..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="premium-table-container max-h-[calc(100vh-320px)]">
              <table className="premium-table">
                <thead className="premium-thead">
                  <tr>
                    <th className="premium-th min-w-[140px]">Registro</th>
                    <th className="premium-th min-w-[150px]">Ubicación</th>
                    <th className="premium-th min-w-[200px]">Funcionario</th>
                    <th className="premium-th min-w-[350px]">Descripción del Problema</th>
                    <th className="premium-th text-center min-w-[140px]">Estado Actual</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <span className="animate-pulse font-bold text-slate-300 uppercase tracking-widest">
                          Sincronizando casos...
                        </span>
                      </td>
                    </tr>
                  ) : currentItems.length > 0 ? (
                    currentItems.map(row => (
                      <tr key={row._id} className="premium-tr group">
                        <td className="premium-td">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-[13px] font-bold text-primary-container">
                              <span className="material-symbols-outlined !text-[16px] opacity-40">
                                calendar_today
                              </span>
                              {row.fecha ? new Date(row.fecha).toLocaleDateString() : '—'}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-6">
                              ID: {row.codigoCaso || row._id.slice(-6)}
                            </span>
                          </div>
                        </td>
                        <td className="premium-td">
                          <div className="flex items-center gap-2 text-[13px] font-semibold text-on-surface">
                            <span className="material-symbols-outlined !text-[18px] text-emerald-500 font-variation-['FILL'_1]">
                              pin_drop
                            </span>
                            {row.ambiente?.nombre || 'Sede Principal'}
                          </div>
                        </td>
                        <td className="premium-td">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                              {(typeof row.usuario === 'object' ? row.usuario?.nombre : '')
                                ?.substring(0, 2)
                                .toUpperCase() || '??'}
                            </div>
                            <span className="text-[13px] font-bold text-on-surface">
                              {typeof row.usuario === 'object' ? row.usuario?.nombre : 'No asignado'}
                            </span>
                          </div>
                        </td>
                        <td className="premium-td">
                          <p className="text-[13px] font-medium text-on-surface leading-relaxed line-clamp-2">
                            {row.descripcion}
                          </p>
                        </td>
                        <td className="premium-td text-center">
                          <span
                            className={`status-badge ${row.estado === 'pendiente' ? 'status-pendiente' : 'status-proceso'}`}
                          >
                            {row.estado}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                          <span className="material-symbols-outlined !text-[64px]">task_alt</span>
                          <p className="text-sm font-black uppercase tracking-[0.2em]">
                            No tienes casos activos asignados
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination-footer">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Carga de Trabajo — Página {currentPage}
                </span>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  {totalItems} casos asignados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="pagination-btn"
                >
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
