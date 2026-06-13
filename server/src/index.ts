import 'dotenv/config'
import { app, server } from './core/app'
import { dbConnect } from './shared/config/mongo'
import { validateEnvOnBoot } from './shared/config/env'
import { assertJwtSecretOnBoot } from './shared/config/jwt'
import { setupSocketAdapterIfConfigured } from './shared/config/socketAdapter'

const port = process.env.PORT || 8000

async function startServer(): Promise<void> {
  validateEnvOnBoot()
  assertJwtSecretOnBoot()

  try {
    await dbConnect()
    await setupSocketAdapterIfConfigured()
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error)
    process.exit(1)
  }

  server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
  })
}

if (process.env.NODE_ENV !== 'test') {
  void startServer()
}

export { app, server }
