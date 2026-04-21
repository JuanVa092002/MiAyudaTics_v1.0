import { Router } from 'express'
import {
  getUsuarios,
  getUsuariosId,
  getPerfilUsuario,
  updateUsuarios,
  inactivarUsuarios,
  usuariosInactivos,
  usuariosActivos,
  reactivarUsuarios,
} from '../controllers/usuarios'
import { uploadMiddleware } from '../utils/handleStorage'
import { checkRol } from '../middleware/rol'
import { authMiddleware } from '../middleware/session'
import { validatorUpdateUsuarios, validatorUsuariosId } from '../validators/usuarios'

const router = Router()

// http://localhost:3010/api/usuarios/
// http://localhost:3010/api/usuarios/perfil
// http://localhost:3010/api/usuarios/inactivos
// http://localhost:3010/api/usuarios/:idUsuario/inactivar
// http://localhost:3010/api/usuarios/:idUsuario/reactivar

router.get('/', getUsuarios)
router.get(
  '/perfil',
  authMiddleware,
  checkRol(['lider', 'tecnico', 'funcionario']),
  getPerfilUsuario
)
router.put(
  '/perfil',
  authMiddleware,
  checkRol(['lider', 'tecnico', 'funcionario']),
  uploadMiddleware.single('foto'),
  validatorUpdateUsuarios,
  updateUsuarios
)
router.get('/activos', authMiddleware, checkRol(['lider']), usuariosActivos)
router.get('/inactivos', authMiddleware, checkRol(['lider']), usuariosInactivos)
router.get('/:id', validatorUsuariosId, getUsuariosId)
router.put(
  '/:id/inactivar',
  authMiddleware,
  checkRol(['lider']),
  validatorUsuariosId,
  inactivarUsuarios
)
router.put(
  '/:id/reactivar',
  authMiddleware,
  checkRol(['lider']),
  validatorUsuariosId,
  reactivarUsuarios
)

export default router
