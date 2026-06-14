import 'dotenv/config'
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import { configureMongoDns } from '../shared/config/mongo'
import { DEFAULT_AVATAR_FILENAME } from '../shared/constants/media'
import { isCloudinaryEnabled } from '../shared/config/cloudinary'

const DB_URI = process.env.DB_URI
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:8000'

const WAR_ROOM = {
  funcionario: {
    nombre: 'War Room Funcionario',
    correo: 'warroom.func@test.local',
    password: 'test1234',
    rol: 'funcionario',
    telefono: '3001111001',
  },
  tecnico: {
    nombre: 'War Room Tecnico',
    correo: 'warroom.tec@test.local',
    password: 'test1234',
    rol: 'tecnico',
    telefono: '3001111002',
  },
} as const

function resolveDefaultAvatarUrl(): string {
  const fromEnv = process.env.CLOUDINARY_DEFAULT_AVATAR_URL?.trim()
  if (fromEnv) return fromEnv
  if (isCloudinaryEnabled()) {
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${process.env.CLOUDINARY_FOLDER || 'miayudatics'}/defaults/${DEFAULT_AVATAR_FILENAME}`
  }
  return `${PUBLIC_URL.replace(/\/$/, '')}/${DEFAULT_AVATAR_FILENAME}`
}

async function upsertUser(
  Usuario: mongoose.Model<unknown>,
  Storage: mongoose.Model<unknown>,
  data: (typeof WAR_ROOM)[keyof typeof WAR_ROOM],
  options: { activo: boolean; estado: boolean }
) {
  const defaultPhoto = await Storage.findOne({ filename: DEFAULT_AVATAR_FILENAME })
  const hashedPassword = await bcryptjs.hash(data.password, 10)
  const existing = await Usuario.findOne({ correo: data.correo }) as {
    nombre?: string
    rol?: string
    telefono?: string
    activo?: boolean
    estado?: boolean
    password?: string
    foto?: mongoose.Types.ObjectId
    save: () => Promise<unknown>
  } | null

  if (existing) {
    existing.nombre = data.nombre
    existing.rol = data.rol
    existing.telefono = data.telefono
    existing.activo = options.activo
    existing.estado = options.estado
    existing.password = hashedPassword
    if (defaultPhoto) existing.foto = defaultPhoto._id
    await existing.save()
    console.log(`--- Usuario actualizado: ${data.correo} ---`)
    return
  }

  await Usuario.create({
    ...data,
    password: hashedPassword,
    activo: options.activo,
    estado: options.estado,
    foto: defaultPhoto?._id,
  })
  console.log(`--- Usuario creado: ${data.correo} ---`)
}

async function seed() {
  if (!DB_URI) {
    console.error('ERROR: No se encontró DB_URI en .env')
    process.exit(1)
  }

  try {
    configureMongoDns()
    await mongoose.connect(DB_URI)
    console.log('--- WAR ROOM E2E SEED: conectado a MongoDB ---')

    const storageSchema = new mongoose.Schema(
      { filename: String, url: String },
      { timestamps: true }
    )
    const Storage = mongoose.models.Storage || mongoose.model('Storage', storageSchema)

    let defaultPhoto = await Storage.findOne({ filename: DEFAULT_AVATAR_FILENAME })
    if (!defaultPhoto) {
      defaultPhoto = await Storage.create({
        filename: DEFAULT_AVATAR_FILENAME,
        url: resolveDefaultAvatarUrl(),
      })
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

    await upsertUser(Usuario, Storage, WAR_ROOM.funcionario, { activo: true, estado: true })
    await upsertUser(Usuario, Storage, WAR_ROOM.tecnico, { activo: true, estado: true })

    const ambienteSchema = new mongoose.Schema(
      { nombre: String, activo: Boolean },
      { timestamps: true }
    )
    const Ambiente = mongoose.models.Ambiente || mongoose.model('Ambiente', ambienteSchema)
    const ambienteCount = await Ambiente.countDocuments({ activo: true })
    if (ambienteCount === 0) {
      await Ambiente.create({ nombre: 'War Room Lab 101', activo: true })
      console.log('--- Ambiente de prueba creado ---')
    }

    const tipoCasoSchema = new mongoose.Schema({ nombre: String }, { timestamps: true })
    const TipoCaso = mongoose.models.TipoDeCaso || mongoose.model('TipoDeCaso', tipoCasoSchema)
    const tipoCount = await TipoCaso.countDocuments()
    if (tipoCount === 0) {
      await TipoCaso.create({ nombre: 'War Room — Falla general' })
      console.log('--- Tipo de caso de prueba creado ---')
    }

    console.log('-------------------------------------------')
    console.log('WAR ROOM E2E — credenciales:')
    console.log('Funcionario: warroom.func@test.local / test1234')
    console.log('Técnico:     warroom.tec@test.local / test1234')
    console.log('Líder:       lidertest@gmail.com / test1234 (seed-lider)')
    console.log('-------------------------------------------')

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('ERROR EN WAR ROOM SEED:', error)
    process.exit(1)
  }
}

seed()
