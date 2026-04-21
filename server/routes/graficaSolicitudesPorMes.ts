import { Router } from 'express'
import { getSolicitudesPorMes } from '../controllers/graficaSolicitudesPorMes'

const router = Router()

/* Ruta para obtener las solicitudes por mes:
http://localhost:3010/api/graficaSolicitudesPorMes

Ruta para obtener la grafica de las solicitudes por mes
http://localhost:3010/solicitudesPorMes.html */

router.get('/', getSolicitudesPorMes)

export default router
