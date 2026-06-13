import { Router } from 'express'
import authRoutes from '../features/auth/routes/auth'
import recuperarPasswordRoutes from '../features/auth/routes/recuperarPassword'
import restablecerPasswordRoutes from '../features/auth/routes/restablecerPassword'
import usuariosRoutes from '../features/users/routes/usuarios'
import tecnicosRoutes from '../features/users/routes/tecnicos'
import solicitudRoutes from '../features/tickets/routes/solicitud'
import solucionCasoRoutes from '../features/tickets/routes/solucionCaso'
import tipoCasoRoutes from '../features/tickets/routes/tipoCaso'
import graficaAmbienteRoutes from '../features/tickets/routes/graficaSolicitudesPorAmbiente'
import graficaMesRoutes from '../features/tickets/routes/graficaSolicitudesPorMes'
import ambienteFormacionRoutes from '../features/shared/routes/ambienteFormacion'
import notificacionesRoutes from '../features/shared/routes/notificaciones'
import storageRoutes from '../features/shared/routes/storage'
import mediaRoutes from '../features/shared/routes/media'

const router = Router()

router.use('/auth', authRoutes)
router.use('/recuperarPassword', recuperarPasswordRoutes)
router.use('/restablecerPassword', restablecerPasswordRoutes)
router.use('/usuarios', usuariosRoutes)
router.use('/tecnicos', tecnicosRoutes)
router.use('/solicitud', solicitudRoutes)
router.use('/solucionCaso', solucionCasoRoutes)
router.use('/tipoCaso', tipoCasoRoutes)
router.use('/graficaSolicitudesPorAmbiente', graficaAmbienteRoutes)
router.use('/graficaSolicitudesPorMes', graficaMesRoutes)
router.use('/ambienteFormacion', ambienteFormacionRoutes)
router.use('/notificaciones', notificacionesRoutes)
router.use('/storage', storageRoutes)
router.use('/media', mediaRoutes)

export default router

