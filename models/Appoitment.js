import mongoose from 'mongoose'

const appoitmentSchema = mongoose.Schema({
  services: [
    {
      type: mongoose.Schema.Types.ObjectId, // aqui queremos obtener el id del servicio que se esta solicitadon al modelo
      ref: 'Services' //aqui se hace referencia al modelo de servicio de servicios
    }
  ],
  date: {
    type: Date
  },
  time: {
    type: String
  },
  totalAmount: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Appoitment = mongoose.model('Appoitment', appoitmentSchema)

export default Appoitment
