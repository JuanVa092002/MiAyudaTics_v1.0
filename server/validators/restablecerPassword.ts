import { check } from 'express-validator'
import { validateResults } from '../utils/handleValidator'
import { Request, Response, NextFunction } from 'express'

export const validatorPassword = [
  check('password')
    .exists()
    .isLength({ min: 6 })
    .notEmpty()
    .trim()
    .escape()
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
    .withMessage(
      'La contraseña debe tener una longitud mínima de 6 caracteres y contener al menos una letra y un número'
    ),
  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next) // Usa validateResults como middleware de validación
  },
]
