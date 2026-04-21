import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()
const PATH_ROUTES = __dirname

const removeExtension = (fileName: string): string => {
  return fileName.split('.').shift() as string
}

// Función asíncrona para cargar las rutas dinámicamente
const loadRoutes = async (): Promise<void> => {
  const files = fs.readdirSync(PATH_ROUTES).filter(file => {
    const ext = path.extname(file)
    const name = removeExtension(file)
    return ext === '.ts' && name !== 'index'
  })

  for (const file of files) {
    const name = removeExtension(file)
    try {
      const module = await import(`./${file}`)
      const route = module.default || module

      if (
        typeof route === 'function' ||
        (typeof route === 'object' && typeof route?.use === 'function')
      ) {
        router.use(`/${name}`, route)
      } else {
        console.error(`[routes/index] ${file} no exporta un Router válido.`)
      }
    } catch (error) {
      console.error(`[routes/index] Error al cargar la ruta ${file}:`, error)
    }
  }
}

// Iniciar la carga de rutas (Express permite añadir rutas al router de forma diferida)
export const routesLoaded = loadRoutes()

export default router
