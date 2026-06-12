import 'dotenv/config'
import { app, server } from './core/app'
import { dbConnect } from './shared/config/mongo'
import { validateEnvOnBoot } from './shared/config/env'
import { assertJwtSecretOnBoot } from './shared/config/jwt'

const port = process.env.PORT || 8000

if (process.env.NODE_ENV !== 'test') {
  validateEnvOnBoot()
  assertJwtSecretOnBoot()
  server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
  })
  dbConnect()
}

export { app, server }
