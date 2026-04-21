import mongoose from 'mongoose'

export const dbConnect = (): void => {
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
