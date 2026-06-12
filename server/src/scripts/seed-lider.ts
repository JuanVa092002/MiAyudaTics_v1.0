import 'dotenv/config'
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import { configureMongoDns } from '../shared/config/mongo'
import { DEFAULT_AVATAR_FILENAME } from '../shared/constants/media'
import { isCloudinaryEnabled } from '../shared/config/cloudinary'

const DB_URI = process.env.DB_URI
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:8000'

function resolveDefaultAvatarUrl(): string {
  const fromEnv = process.env.CLOUDINARY_DEFAULT_AVATAR_URL?.trim()
  if (fromEnv) return fromEnv
  if (isCloudinaryEnabled()) {
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${process.env.CLOUDINARY_FOLDER || 'miayudatics'}/defaults/${DEFAULT_AVATAR_FILENAME}`
  }
  return `${PUBLIC_URL.replace(/\/$/, '')}/${DEFAULT_AVATAR_FILENAME}`
}

async function seed() {
  if (!DB_URI) {
    console.error('ERROR: No se encontró DB_URI en .env')
    process.exit(1)
  }

  try {
    configureMongoDns()
    await mongoose.connect(DB_URI)
    console.log('--- CONECTADO A MONGODB ATLAS ---')

    const storageSchema = new mongoose.Schema(
      {
        filename: String,
        url: String,
      },
      { timestamps: true }
    )
    const Storage = mongoose.models.Storage || mongoose.model('Storage', storageSchema)

    let defaultPhoto = await Storage.findOne({ filename: DEFAULT_AVATAR_FILENAME })
    if (!defaultPhoto) {
      defaultPhoto = await Storage.create({
        filename: DEFAULT_AVATAR_FILENAME,
        url: resolveDefaultAvatarUrl(),
      })
      console.log('--- FOTO PREDETERMINADA CREADA ---')
    }

    const usuarioSchema = new mongoose.Schema(
      {
        nombre: String,
        correo: { type: String, unique: true },
        rol: String,
        telefono: String,
        password: { type: String, select: false },
        activo: Boolean,
        estado: Boolean,
        foto: { type: mongoose.Schema.Types.ObjectId, ref: 'Storage' },
      },
      { timestamps: true }
    )
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
        foto: defaultPhoto._id,
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
