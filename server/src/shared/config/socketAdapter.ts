import { io } from '../utils/handleSocket'

export async function setupSocketAdapterIfConfigured(): Promise<void> {
  const redisUrl = process.env.REDIS_URL?.trim()
  if (!redisUrl) return

  try {
    const { createAdapter } = await import('@socket.io/redis-adapter')
    const { createClient } = await import('redis')
    const pubClient = createClient({ url: redisUrl })
    const subClient = pubClient.duplicate()
    await Promise.all([pubClient.connect(), subClient.connect()])
    io.adapter(createAdapter(pubClient, subClient))
    console.log('Socket.IO Redis adapter enabled')
  } catch (error) {
    console.error('REDIS_URL set but adapter failed to initialize:', error)
  }
}
