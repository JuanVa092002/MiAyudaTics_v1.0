import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { resetPassword } from '../controllers/restablecerPassword'
import { validatorPassword } from '../../../shared/validators/restablecerPassword'

const router = Router()

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,                    // máximo 5 intentos por IP
  message: {
    message: 'Demasiados intentos. Espera 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// http://localhost:3010/api/restablecerPassword/:token
router.post('/:token', resetPasswordLimiter, validatorPassword, resetPassword)

export default router

