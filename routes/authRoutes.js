import express from 'express'
import { register, verifyAccount, login, user, forgotPassword, verifyPasswordResetToken, updatePassword, admin, getUser } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()


// Rutas de autenticación y registro de usuarios
router.post('/register', register)
router.get('/verify/:token', verifyAccount )
router.post('/login', login)
router.post('/forgot-password', forgotPassword)

router.route('/forgot-password/:token')
      .get(verifyPasswordResetToken)
      .post(updatePassword)


// area privada - requiere un JWT
router.get('/user', authMiddleware, user)
router.get('/admin', authMiddleware, admin)
router.get('/admin/:id', authMiddleware, getUser)

export default router
