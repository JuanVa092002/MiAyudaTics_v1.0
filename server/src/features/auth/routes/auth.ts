import { Router } from 'express'
import { validatorRegister, validatorLogin } from '../../../shared/validators/auth'
import { uploadMiddleware } from '../../../shared/utils/handleStorage'
import { registerCtrl, loginCtrl, verifyToken, createLogout } from '../controllers/auth'
import { authLimiter } from '../../../shared/config/rateLimit'

const router = Router()

router.post('/register', authLimiter, uploadMiddleware.single('foto'), validatorRegister, registerCtrl)
router.post('/login', authLimiter, validatorLogin, loginCtrl)
router.get('/verify-token', verifyToken)
router.post('/logout', createLogout)

export default router

