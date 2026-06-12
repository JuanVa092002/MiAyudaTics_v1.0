import { Request, Response } from 'express'
import mongoose from 'mongoose'

export const healthCheck = (_req: Request, res: Response): void => {
  const dbState = mongoose.connection.readyState
  const dbOk = dbState === 1

  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'ok' : 'degraded',
    uptime: process.uptime(),
    database: dbOk ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
}
