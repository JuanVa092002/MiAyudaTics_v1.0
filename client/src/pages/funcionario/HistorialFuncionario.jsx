import React, { useEffect, useState } from 'react'
import { HistorialSolicitudesFuncionario } from '../../services/solicitud.services'
import DataTablePkg from 'react-data-table-component'
const DataTable = DataTablePkg.default ?? DataTablePkg

export default function HistorialFuncionario({ refreshKey }) {
  const [historial, setHistorial] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const solicitudes = await HistorialSolicitudesFuncionario()
        setHistorial(solicitudes)
      } catch (error) {
        console.error('Error al cargar el historial:', error)
      }
    }
    fetchHistorial()
  }, [refreshKey])

  const filteredData = historial.filter(row =>
    row.codigoCaso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (estado) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border hairline-border transition-all";
    switch (estado) {
      case 'solicitado':
        return <span className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-100`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>Solicitado
        </span>
      case 'asignado':
        return <span className={`${baseClasses} bg-amber-50 text-amber-700 border-amber-100`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>Asignado
        </span>
      case 'pendiente':
        return <span className={`${baseClasses} bg-orange-50 text-orange-700 border-orange-100`}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>En Proceso
        </span>
      case 'finalizado':
        return <span className={`${baseClasses} bg-green-50 text-green-700 border-green-100`}>
          <span className="material-symbols-outlined !text-[12px] mr-1">verified</span>Completado
        </span>
      default:
        return <span className={`${baseClasses} bg-slate-100 text-slate-600 border-slate-200`}>{estado}</span>
    }
  }

  return (
    <section className="solid-card rounded-3xl overflow-hidden flex flex-col h-full animate-in slide-in-from-right-4 duration-500">
      {/* Header of Table */}
      <div className="p-6 sm:p-8 border-b hairline-border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Historial de Solicitudes</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">Listado completo de reportes técnicos registrados.</p>
        </div>
        <div className="relative w-full sm:w-72 group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[18px] group-focus-within:text-primary-container transition-colors">search</span>
          <input 
            className="w-full pl-11 pr-4 py-2.5 solid-input rounded-2xl text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/10 transition-all placeholder:text-slate-400" 
            placeholder="Buscar por código o descripción..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Body - Premium UX/UI Overhaul */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-0">
          <thead>
            <tr className="bg-slate-50/50 border-b hairline-border border-slate-200">
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70 border-b hairline-border border-slate-200 min-w-[100px]">Ticket</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70 border-b hairline-border border-slate-200 min-w-[130px]">Registro</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70 border-b hairline-border border-slate-200 min-w-[140px]">Ubicación</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70 border-b hairline-border border-slate-200 min-w-[280px]">Detalle del Caso</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70 border-b hairline-border border-slate-200 text-center w-[80px]">Media</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70 border-b hairline-border border-slate-200 min-w-[140px]">Estado</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70 border-b hairline-border border-slate-200 min-w-[160px]">Seguimiento</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* Ticket - Align Top */}
                  <td className="py-6 px-6 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold text-primary-container leading-none">
                        #{row.codigoCaso}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID Sistema</span>
                    </div>
                  </td>

                  {/* Fecha - Align Top */}
                  <td className="py-6 px-6 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-semibold text-on-surface whitespace-nowrap leading-none italic">{row.fecha}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Fecha Reporte</span>
                    </div>
                  </td>

                  {/* Ambiente - Align Top */}
                  <td className="py-6 px-6 align-top">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-verde-sena mt-1.5 shrink-0" />
                      <span className="text-[13px] font-medium text-on-surface leading-snug">
                        {row.ambiente?.nombre || 'No especificado'}
                      </span>
                    </div>
                  </td>

                  {/* Descripción & Solución - Combined for UX Flow */}
                  <td className="py-6 px-6 align-top">
                    <div className="flex flex-col gap-3 max-w-[400px]">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Reporte Inicial</span>
                        <p className="text-[13px] font-medium text-on-surface leading-relaxed line-clamp-3">
                          {row.descripcion}
                        </p>
                      </div>
                      {row.solucion?.descripcionSolucion && (
                        <div className="pl-4 border-l-2 border-verde-sena/30 py-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-verde-sena mb-1 block">Resolución Técnica</span>
                          <p className="text-[12px] font-medium text-on-surface-variant leading-relaxed italic">
                            {row.solucion.descripcionSolucion}
                          </p>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Foto - Align Top */}
                  <td className="py-6 px-6 align-top text-center">
                    {row.foto ? (
                      <a 
                        href={row.foto.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex flex-col items-center gap-1 group/thumb"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden border hairline-border border-slate-200 group-hover/thumb:border-primary-container transition-colors shadow-sm">
                          <img src={row.foto.url} alt="Evidencia" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase group-hover/thumb:text-primary-container">Ver</span>
                      </a>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-dashed border-slate-200 mx-auto">
                        <span className="material-symbols-outlined text-slate-300 text-[18px]">hide_image</span>
                      </div>
                    )}
                  </td>

                  {/* Estado - Align Top */}
                  <td className="py-6 px-6 align-top">
                    <div className="flex flex-col gap-2">
                       {getStatusBadge(row.estado)}
                    </div>
                  </td>

                  {/* Técnico - Align Top */}
                  <td className="py-6 px-6 align-top">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined !text-[14px] text-on-surface-variant">person</span>
                        </div>
                        <span className="text-[13px] font-bold text-on-surface truncate max-w-[120px]">
                          {row.tecnico?.nombre || 'Por asignar'}
                        </span>
                      </div>
                      {row.tecnico && (
                        <span className="text-[10px] font-bold text-verde-sena uppercase tracking-tighter pl-8 italic">Agente Activo</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-24 text-center">
                   <div className="flex flex-col items-center gap-4 opacity-30">
                      <span className="material-symbols-outlined !text-[64px]">layers_clear</span>
                      <p className="text-sm font-black uppercase tracking-[0.2em]">Sin actividad registrada</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer of Table */}
      <div className="p-6 border-t hairline-border border-slate-100 flex items-center justify-between mt-auto bg-slate-50/50">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {filteredData.length} registros totales
        </span>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center border hairline-border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm">
            <span className="material-symbols-outlined !text-[20px]">chevron_left</span>
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center border hairline-border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm">
            <span className="material-symbols-outlined !text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  )
}
