// Biblioteca de Node.js para trabajar con MongoDB.
const mongoose = require('mongoose')

// Función responsable de establecer una conexión con la base de datos MongoDB.
const dbConnect = () => {
  const DB_URI = process.env.DB_URI
  mongoose
    .connect(DB_URI)
    .then(() => {
      console.log('Conectado a la base de datos')
    })
    .catch(error => {
      console.error('Error de conexión a la base de datos:', error)
    })
}

// Exportamos dbConnect para ser utilizada en otras partes de la aplicación.
module.exports = dbConnect
