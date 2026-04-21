import { check } from 'express-validator'

// Validaciones con express-validator
export const validarSolicitud = [
  check('usuario')
    .notEmpty()
    .withMessage('El campo usuario es obligatorio.')
    .isMongoId()
    .withMessage('El ID del usuario no es válido.'),
  check('ambiente')
    .notEmpty()
    .withMessage('El campo ambiente es obligatorio.')
    .isMongoId()
    .withMessage('El ID del ambiente no es válido.'),
  check('descripcion')
    .notEmpty()
    .withMessage('El campo descripción es obligatorio.')
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres.'),
  check('telefono')
    .notEmpty()
    .withMessage('El campo teléfono es obligatorio.')
    .isMobilePhone('any')
    .withMessage('Debe ser un número de teléfono válido.'),
]
