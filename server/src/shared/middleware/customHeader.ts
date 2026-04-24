import { Request, Response, NextFunction } from 'express'

export const customHeader = (req: Request, _res: Response, next: NextFunction): void => {
  console.log(req.body)
  next()
}

