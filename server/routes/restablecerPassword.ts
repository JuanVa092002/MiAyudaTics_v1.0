import { Router } from 'express'
import { resetPassword } from '../controllers/restablecerPassword'
import { validatorPassword } from '../validators/restablecerPassword'

const router = Router()

// http://localhost:3010/api/restablecerPassword/:token
router.post('/:token', validatorPassword, resetPassword)

export default router
