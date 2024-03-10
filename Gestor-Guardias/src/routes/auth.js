import express from 'express'
import { auth, isAdmin } from '../controllers/authController.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.post('/login', auth)
router.get('/isAdmin', verifyToken, isAdmin)

export default router
