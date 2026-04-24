import { Router } from 'express';
import { authMiddleware } from '../../../shared/middleware/session';
import { 
  getNotificaciones, 
  marcarComoLeida, 
  marcarTodasComoLeidas 
} from '../controllers/notificaciones';

const router = Router();

// GET /api/notificaciones
router.get('/', authMiddleware, getNotificaciones);

// PATCH /api/notificaciones/:id/leer
router.patch('/:id/leer', authMiddleware, marcarComoLeida);

// PATCH /api/notificaciones/leer-todas
router.patch('/leer-todas', authMiddleware, marcarTodasComoLeidas);

export default router;

