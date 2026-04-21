import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()
const PATH_ROUTES = __dirname

const removeExtension = (fileName: string): string => {
  return fileName.split('.').shift() as string
}

fs.readdirSync(PATH_ROUTES)
  .filter(file => {
    const ext = path.extname(file)
    const name = removeExtension(file)
    // Solo archivos .ts, excluir index mismo
    return ext === '.ts' && name !== 'index'
  })
  .forEach(file => {
    const name = removeExtension(file)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    let route = require(`./${name}`)

    // Interop ESModule: extract default export
    if (route?.__esModule && route.default) {
      route = route.default
    }

    if (
      typeof route === 'function' ||
      (typeof route === 'object' && typeof route?.use === 'function')
    ) {
      router.use(`/${name}`, route)
    } else {
      console.error(`[routes/index] ${file} no exporta un Router válido.`)
    }
  })

export default router
