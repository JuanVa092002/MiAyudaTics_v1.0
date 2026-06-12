import 'dotenv/config'
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import { configureMongoDns } from '../shared/config/mongo'

const DB_URI = process.env.DB_URI
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3010'

async function seed() {
  if (!DB_URI) {
    console.error('ERROR: No se encontr DB_URI en .env')
    process.exit(1)
  }

  try {
    configureMongoDns()
    await mongoose.connect(DB_URI)
    console.log('--- CONECTADO A MONGODB ATLAS ---')

    // 1. Asegurar Foto Predeterminada
    const storageSchema = new mongoose.Schema({
      filename: String,
      url: String
    }, { timestamps: true })
    const Storage = mongoose.models.Storage || mongoose.model('Storage', storageSchema)

    let defaultPhoto = await Storage.findOne({ filename: 'usuario-undefined.png' })
    if (!defaultPhoto) {
      defaultPhoto = await Storage.create({
        filename: 'usuario-undefined.png',
        url: `${PUBLIC_URL}/usuario-undefined.png`
      })
      console.log('--- FOTO PREDETERMINADA CREADA ---')
    }

    // 2. Crear Usuario Lder
    const usuarioSchema = new mongoose.Schema({
      nombre: String,
      correo: { type: String, unique: true },
      rol: String,
      telefono: String,
      password: { type: String, select: false },
      activo: Boolean,
      estado: Boolean,
      foto: { type: mongoose.Schema.Types.ObjectId, ref: 'Storage' }
    }, { timestamps: true })
    const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema)

    const existingLider = await Usuario.findOne({ correo: 'lidertest@gmail.com' })
    if (existingLider) {
      console.log('--- EL USUARIO LIDER YA EXISTE. ACTUALIZANDO PERMISOS... ---')
      existingLider.activo = true
      existingLider.estado = true
      existingLider.rol = 'lider'
      await existingLider.save()
    } else {
      const hashedPassword = await bcryptjs.hash('test1234', 10)
      await Usuario.create({
        nombre: 'Administrador Lider TIC',
        correo: 'lidertest@gmail.com',
        rol: 'lider',
        telefono: '3000000000',
        password: hashedPassword,
        activo: true,
        estado: true,
        foto: defaultPhoto._id
      })
      console.log('--- USUARIO LIDER CREADO EXITOSAMENTE ---')
    }

    console.log('-------------------------------------------')
    console.log('CREDENCIALES DE ACCESO:')
    console.log('Email: lidertest@gmail.com')
    console.log('Pass: test1234')
    console.log('-------------------------------------------')

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('ERROR EN EL SEED:', error)
    process.exit(1)
  }
}

seed()
