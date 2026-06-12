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

export const dbConnect = (): void => {
  configureMongoDns()
  const DB_URI = process.env.DB_URI as string
  mongoose
    .connect(DB_URI)
    .then(() => {
      console.log('Conectado a la base de datos')
    })
    .catch((error: Error) => {
      console.error('Error de conexión a la base de datos:', error)
    })
}

