import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export const validateResults = (req: Request, res: Response, next: NextFunction): void => {
  try {
    validationResult(req).throw() // Lanza un error si hay resultados de validación
    next() // Continúa con el siguiente middleware
  } catch (error: any) {
    res.status(403).json({ message: 'algo salió mal', errors: error.array() }) // Maneja el error de validación
  }
}
