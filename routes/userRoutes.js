import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { getUserAppoitments } from '../controllers/userController.js'

const router = express.Router()

router.route('/:user/appoitments')
    .get(authMiddleware, getUserAppoitments)


export default router
