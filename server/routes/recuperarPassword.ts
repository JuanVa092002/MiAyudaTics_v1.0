import { Router } from 'express'
import { forgotPassword } from '../controllers/recuperarPassword'

const router = Router()

// http://localhost:3010/api/recuperarPassword/
router.post('/', forgotPassword)

export default router
