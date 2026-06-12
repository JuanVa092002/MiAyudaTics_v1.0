import { Router } from 'express'
import { forgotPassword } from '../controllers/recuperarPassword'
import { forgotPasswordLimiter } from '../../../shared/config/rateLimit'

const router = Router()

router.post('/', forgotPasswordLimiter, forgotPassword)

export default router

