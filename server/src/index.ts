import 'dotenv/config'
import { app, server } from './core/app'
import { dbConnect } from './shared/config/mongo'

const port = process.env.PORT || 8000

// Iniciar el servidor
if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
  })
  dbConnect()
}

export { app, server }
