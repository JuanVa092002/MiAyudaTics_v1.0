import { check } from 'express-validator'
import { validateResults } from '../utils/handleValidator'
import { Request, Response, NextFunction } from 'express'

export const validatorUpdateUsuarios = [
  // No permite edición de 'nombre', 'correo' y 'rol' eliminando sus validaciones
  check('telefono')
    .optional()
    .notEmpty()
    .trim()
    .escape()
    .isNumeric()
    .withMessage('El teléfono debe ser un número'),
  check('password')
    .optional()
    .isLength({ min: 6 })
    .notEmpty()
    .trim()
    .escape()
    .withMessage('La contraseña debe tener al menos 6 caracteres'),

  (req: Request, res: Response, next: NextFunction): void => {
    //  no se envíen `nombre`, `correo`, ni `rol`
    const camposDeshabilitados = ['nombre', 'correo', 'rol']
    for (const campo of camposDeshabilitados) {
      if (req.body[campo]) {
        res.status(400).send({ message: `No se permite actualizar el campo ${campo}` })
        return
      }
    }
    validateResults(req, res, next)
  },
]

export const validatorUsuariosId = [
  check('id').isMongoId().exists().notEmpty().trim().escape().withMessage('El id es requerido'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next)
  },
]
