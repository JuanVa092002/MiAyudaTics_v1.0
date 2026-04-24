import React, { useState } from 'react'
import Modal from 'react-modal'
import './css/modal.css'

const SolutionModal = ({
  isOpen,
  onRequestClose,
  onSubmit,
  solutionDescription = '', // Asegúrate de que tenga un valor por defecto
  setSolutionDescription,
  caseType = '', // Valor por defecto
  setCaseType,
  solutionType = '', // Valor por defecto
  setSolutionType,
  caseTypes, // Recibe los tipos de caso desde las props
}) => {
  // Estado para la imagen
  const [selectedImage, setSelectedImage] = useState(null)

  // Validar que caseTypes es un array
  if (!Array.isArray(caseTypes)) {
    console.error('caseTypes debe ser un array', caseTypes)
    return null // Opcional: puedes mostrar un mensaje de error o un estado alternativo aquí
  }

  const handleImageChange = event => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(URL.createObjectURL(file)) // Crear una URL temporal para previsualizar la imagen
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Solucionar Caso"
      className="modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false} // Para desactivar advertencias si no usas setAppElement
    >
      <div className="modal-header">
        <div>
          <h2 className="modal-title">Solucionar Caso</h2>
          <p className="modal-subtitle">Registra el avance y estado final del ticket seleccionado.</p>
        </div>
        <button type="button" onClick={onRequestClose} className="modal-close-btn" aria-label="Cerrar modal">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form
        className="modal-form"
        onSubmit={e => {
          e.preventDefault()
          onSubmit() // Llama a la función de envío con los datos actuales del formulario
        }}
      >
        <div className="modal-field">
          <label htmlFor="solutionDescription" className="modal-label">
            Descripción de la solución
          </label>
          <textarea
            id="solutionDescription"
            value={solutionDescription} // Asegúrate de que tenga un valor definido
            onChange={e => setSolutionDescription(e.target.value)}
            className="modal-textarea"
            rows={2} // Establece el número de filas visibles
            required
          />
        </div>

        <div className="modal-field">
          <label htmlFor="caseType" className="modal-label">
            Tipo de caso
          </label>
          <select
            id="caseType"
            value={caseType} // Asegúrate de que tenga un valor definido
            onChange={e => setCaseType(e.target.value)}
            className="modal-input"
            required
          >
            <option value="">Seleccionar tipo</option>
            {caseTypes.map((type, index) => (
              <option key={type.id || index} value={type.id}>
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
            value={solutionType} // Asegúrate de que tenga un valor definido
            onChange={e => setSolutionType(e.target.value)}
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
            <img
              src={selectedImage}
              alt="Previsualización"
              className="modal-preview-image"
            />
          </div>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onRequestClose} className="modal-btn modal-btn-secondary">
            Cancelar
          </button>
          <button
            type="submit"
            className="modal-btn modal-btn-primary"
          >
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default SolutionModal
