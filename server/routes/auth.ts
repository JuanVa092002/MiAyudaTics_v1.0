import { Router } from 'express'
import { validatorRegister, validatorLogin } from '../validators/auth'
import { uploadMiddleware } from '../utils/handleStorage'
import { registerCtrl, loginCtrl, verifyToken, createLogout } from '../controllers/auth'

const router = Router()

// http://localhost:3010/api/auth/register
// http://localhost:3010/api/auth/login
// http://localhost:3010/api/auth/logout

router.post('/register', uploadMiddleware.single('foto'), validatorRegister, registerCtrl)
router.post('/login', validatorLogin, loginCtrl)
router.get('/verify-token', verifyToken)
router.post('/logout', createLogout)

export default router
