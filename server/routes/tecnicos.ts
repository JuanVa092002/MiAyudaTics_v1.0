import { Router } from 'express'
import {
  listaTecnicosPendientes,
  aprobarTecnico,
  denegarTecnico,
  listaTecnicosAprobados,
} from '../controllers/tecnicos'
import { checkRol } from '../middleware/rol'
import { authMiddleware } from '../middleware/session'

const router = Router()

// http://localhost:3010/api/tecnicos/

router.get('/tecnicosPendientes', authMiddleware, checkRol(['lider']), listaTecnicosPendientes)
router.get('/tecnicosAprobados', authMiddleware, checkRol(['lider']), listaTecnicosAprobados)
router.put('/:id/aprobarTecnico', authMiddleware, checkRol(['lider']), aprobarTecnico)
router.put('/:id/denegarTecnico', authMiddleware, checkRol(['lider']), denegarTecnico)

export default router
