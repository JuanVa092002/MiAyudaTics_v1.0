import { Router } from 'express'
import { getSolicitudesPorAmbientes } from '../controllers/graficaSolicitudesPorAmbiente'

const router = Router()

/*  Ruta para obtener las solicitudes por ambiente
 http://localhost:3010/api/graficaSolicitudesPorAmbiente 

 Ruta para obtener la grafica
 http://localhost:3010/solicitudesPorAmbiente.html  */

router.get('/', getSolicitudesPorAmbientes)

export default router

