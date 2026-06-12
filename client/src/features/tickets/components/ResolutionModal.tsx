import { useState, type ReactNode, type FormEvent, type ChangeEvent } from 'react'
import Modal from 'react-modal'
import type { TipoCaso, TipoSolucion } from '@/shared/types'
import '@/pages/tecnico/css/modal.css'

export interface ResolutionModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSubmit: () => void
  solutionDescription?: string
  setSolutionDescription: (value: string) => void
  caseType?: string
  setCaseType: (value: string) => void
  solutionType?: TipoSolucion | ''
  setSolutionType: (value: TipoSolucion) => void
  caseTypes: TipoCaso[]
}

export default function ResolutionModal({
  isOpen,
  onRequestClose,
  onSubmit,
  solutionDescription = '',
  setSolutionDescription,
  caseType = '',
  setCaseType,
  solutionType = '',
  setSolutionType,
  caseTypes,
}: ResolutionModalProps): ReactNode {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!Array.isArray(caseTypes)) {
    return null
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(URL.createObjectURL(file))
    }
  }

  const handleFormSubmit = (e: FormEvent): void => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Solucionar Caso"
      className="modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="modal-header">
        <div>
          <h2 className="modal-title">Solucionar Caso</h2>
          <p className="modal-subtitle">Registra el avance y estado final del ticket seleccionado.</p>
        </div>
        <button
          type="button"
          onClick={onRequestClose}
          className="modal-close-btn"
          aria-label="Cerrar modal"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form className="modal-form" onSubmit={handleFormSubmit}>
        <div className="modal-field">
          <label htmlFor="solutionDescription" className="modal-label">
            Descripción de la solución
          </label>
          <textarea
            id="solutionDescription"
            value={solutionDescription}
            onChange={e => setSolutionDescription(e.target.value)}
            className="modal-textarea"
            rows={2}
            required
          />
        </div>

        <div className="modal-field">
          <label htmlFor="caseType" className="modal-label">
            Tipo de caso
          </label>
          <select
            id="caseType"
            value={caseType}
            onChange={e => setCaseType(e.target.value)}
            className="modal-input"
            required
          >
            <option value="">Seleccionar tipo</option>
            {caseTypes.map(type => (
              <option key={type._id} value={type._id}>
                {type.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-field">
          <label htmlFor="solutionType" className="modal-label">
            Tipo de solución
          </label>
          <select
            id="solutionType"
            value={solutionType}
            onChange={e => setSolutionType(e.target.value as TipoSolucion)}
            className="modal-input"
            required
          >
            <option value="">Seleccionar tipo</option>
            <option value="pendiente">pendiente</option>
            <option value="finalizado">finalizado</option>
          </select>
        </div>

        <div className="modal-field">
          <label htmlFor="imageUpload" className="modal-label">
            Cargar imagen
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="modal-input modal-file-input"
          />
        </div>

        {selectedImage && (
          <div className="modal-preview">
            <h3 className="modal-preview-title">Previsualización de imagen</h3>
            <img src={selectedImage} alt="Previsualización" className="modal-preview-image" />
          </div>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onRequestClose} className="modal-btn modal-btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="modal-btn modal-btn-primary">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  )
}
