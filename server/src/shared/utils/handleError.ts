import { Response } from 'express'
import { logError } from './logger'

export const handleHttpError = (
  res: Response,
  message: string = 'Algo sucedió',
  code: number = 500,
  cause?: unknown
): void => {
  if (code >= 500) {
    logError(message, cause)
  }
  res.status(code)
  res.send({ message })
}

