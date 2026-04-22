import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import path from 'path'
import dotenv from 'dotenv'

// 1. CARGAR ENV ANTES DE TODO
dotenv.config({ path: path.resolve(__dirname, '../../.env.test'), override: true })

import { app } from '../../app'
import models from '../../models'
import { encrypt } from '../../utils/handlePassword'

const { usuarioModel } = models

const testUsers = {
  funcionario: {
    nombre: 'Juan Funcionario',
    correo: 'funcionario_test@miayudatics.com',
    password: 'password123',
    rol: 'funcionario',
    telefono: '3001234567',
    activo: true,
    estado: true
  },
  tecnico: {
    nombre: 'Pedro Tecnico',
    correo: 'tecnico_test@miayudatics.com',
    password: 'password123',
    rol: 'tecnico',
    telefono: '3007654321',
    activo: true,
    estado: true
  },
  lider: {
    nombre: 'Maria Lider',
    correo: 'lider_test@miayudatics.com',
    password: 'password123',
    rol: 'lider',
    telefono: '3005555555',
    activo: true,
    estado: true
  }
}

const testData = {
  ambiente: {
    nombre: 'Ambiente Test 101',
    activo: true
  }
}

describe('FASE 3.5 — PRODUCTION SIMULATION', () => {
  let funcionarioToken: string
  let liderToken: string
  let funcionarioId: string
  let solicitudId: string

  beforeAll(async () => {
    const uri = process.env.DB_URI
    console.log(`--- SIMULACION: CONECTANDO A ${uri?.substring(0, 30)}... ---`)
    
    if (!uri || !uri.includes('miayudatics_simulation')) {
      throw new Error('CRITICAL: DB_URI incorrecta para simulacin: ' + uri)
    }

    await mongoose.connect(uri)
    await mongoose.connection.dropDatabase()
    
    // Seed
    for (const user of Object.values(testUsers)) {
      const hashedPassword = await encrypt(user.password)
      await usuarioModel.create({ ...user, password: hashedPassword })
    }
    await models.ambienteModel.create(testData.ambiente)
    
    const count = await usuarioModel.countDocuments()
    const sample = await usuarioModel.findOne({ correo: testUsers.funcionario.correo })
    console.log(`--- SIMULACION: DB PREPARADA. Usuarios: ${count}. Encontrado: ${sample?.correo} ---`)

    vi.mock('morgan', () => ({
      default: () => (_req: any, _res: any, next: any) => next(),
    }))
  }, 60000)

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
      console.log('--- SIMULACION: DB LIMPIADA Y CERRADA ---')
    }
  })

  it('S-01 | Boot real con Atlas', async () => {
    expect(mongoose.connection.readyState).toBe(1)
    expect(mongoose.connection.name).toBe('miayudatics_simulation')
    const response = await request(app).get('/api/usuarios')
    expect(response.status).not.toBe(500)
  })

  it('S-02 | Auth flow completo', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        correo: testUsers.funcionario.correo,
        password: testUsers.funcionario.password
      })

    expect(loginRes.status).toBe(200)
    expect(loginRes.body.dataUser).toHaveProperty('token')
    funcionarioToken = loginRes.body.dataUser.token
    funcionarioId = loginRes.body.dataUser.user._id

    const perfilRes = await request(app)
      .get('/api/usuarios/perfil')
      .set('Authorization', `Bearer ${funcionarioToken}`)

    expect(perfilRes.status).toBe(200)
    expect(perfilRes.body.data.correo).toBe(testUsers.funcionario.correo)
  })

  it('S-03 | RBAC real por rol', async () => {
    // 1. Funcionario -> Lider (403)
    const resForbidden = await request(app)
      .get('/api/tecnicos/tecnicosPendientes')
      .set('Authorization', `Bearer ${funcionarioToken}`)
    expect(resForbidden.status).toBe(403)

    // 2. Login Lider -> OK
    const loginLider = await request(app)
      .post('/api/auth/login')
      .send({
        correo: testUsers.lider.correo,
        password: testUsers.lider.password
      })
    liderToken = loginLider.body.dataUser.token

    const resOk = await request(app)
      .get('/api/tecnicos/tecnicosPendientes')
      .set('Authorization', `Bearer ${liderToken}`)
    expect(resOk.status).toBe(200)
  })

  it('S-04 | Solicitud completa de inicio a fin', async () => {
    const ambiente = await models.ambienteModel.findOne({ nombre: testData.ambiente.nombre })
    
    const createRes = await request(app)
      .post('/api/solicitud')
      .set('Authorization', `Bearer ${funcionarioToken}`)
      .send({
        ambiente: ambiente?._id,
        descripcion: 'Problema real detectado en simulacin',
        telefono: '3001234567',
        usuario: funcionarioId
      })

    expect(createRes.status).toBe(201)
    expect(createRes.body.message).toContain('exitoso')
    solicitudId = createRes.body.solicitud._id

    const listRes = await request(app)
      .get('/api/solicitud')
      .set('Authorization', `Bearer ${liderToken}`)
    
    const found = listRes.body.data.find((s: any) => s._id === solicitudId)
    expect(found).toBeDefined()
  })

  it('S-05 | Email trigger real con Brevo', async () => {
    const response = await request(app)
      .post('/api/recuperarPassword')
      .send({ correo: testUsers.funcionario.correo })

    expect(response.status).toBe(200)
    expect(response.body.message).toContain('enviado')
  }, 20000)
})
