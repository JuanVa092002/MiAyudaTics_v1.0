import { ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { Request, Response, NextFunction } from 'express'

export const handleValidator =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({ ...req.body, ...req.params, ...req.query })
    if (!result.success) {
      const error = fromZodError(result.error)
      res.status(422).json({ errors: error.details })
      return
    }

    // Mapear datos validados/transformados de vuelta a sus fuentes originales
    const data = result.data as Record<string, any>
    Object.keys(data).forEach((key) => {
      if (key in req.body) req.body[key] = data[key]
      if (key in req.params) req.params[key] = data[key]
      if (key in req.query) req.query[key] = data[key]
    })

    next()
  }

