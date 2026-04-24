import path from 'path'
import multer from 'multer'
import { Request } from 'express'

const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    const pathStorage = path.join(__dirname, '../storage')
    cb(null, pathStorage)
  },

  filename: function (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const extFile = file.originalname.split('.').pop()
    const filename = `file-${Date.now()}.${extFile}`
    cb(null, filename)
  },
})

export const uploadMiddleware = multer({ storage: storage })

