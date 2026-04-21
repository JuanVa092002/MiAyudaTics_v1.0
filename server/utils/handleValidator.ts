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
    req.body = result.data
    next()
  }
