import express from 'express'
import { createAppoitment, getAppoitmentsBydate, getAppoitmentsById, updateAppoitment, deleteAppoitment, getAllAppoitments } from '../controllers/appoitmentController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()
router.route('/getAll')
  .get(authMiddleware, getAllAppoitments)

router.route('/')
  .post(authMiddleware, createAppoitment)
  .get(authMiddleware, getAppoitmentsBydate)

router.route('/:id')
  .get(authMiddleware, getAppoitmentsById)
  .put(authMiddleware, updateAppoitment)
  .delete(authMiddleware, deleteAppoitment)



export default router
