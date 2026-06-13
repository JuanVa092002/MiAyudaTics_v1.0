import dns from 'dns'
import mongoose from 'mongoose'

export function configureMongoDns(): void {
  const fromEnv = process.env.MONGO_DNS_SERVERS?.trim()
  if (fromEnv) {
    dns.setServers(fromEnv.split(',').map(s => s.trim()).filter(Boolean))
    return
  }

  // En local, SRV de Atlas suele fallar con DNS corporativo o del ISP (querySrv ECONNREFUSED)
  if (process.env.NODE_ENV !== 'production') {
    dns.setServers(['8.8.8.8', '8.8.4.4'])
  }
}

export async function dbConnect(): Promise<void> {
  configureMongoDns()
  const dbUri = process.env.DB_URI?.trim()
  if (!dbUri) {
    throw new Error('DB_URI no está configurada')
  }

  await mongoose.connect(dbUri)
  console.log('Conectado a la base de datos')
}
