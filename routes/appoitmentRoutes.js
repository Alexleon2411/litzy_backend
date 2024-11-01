import express from 'express'
import { createAppoitment, getAppoitmentsBydate, getAppoitmentsById, updateAppoitment, deleteAppoitment } from '../controllers/appoitmentController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()
router.route('/')
  .post(authMiddleware, createAppoitment)
  .get(authMiddleware, getAppoitmentsBydate)

router.route('/:id')
  .get(authMiddleware, getAppoitmentsById)
  .put(authMiddleware, updateAppoitment)
  .delete(authMiddleware, deleteAppoitment)



export default router
