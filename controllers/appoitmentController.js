import Appoitment from "../models/Appoitment.js";
import { handleNotFoundError, validateObjectId, formatDate } from "../utils/index.js";
import { parse, formatISO, startOfDay, endOfDay } from 'date-fns'
import { sendEmailNewAppoitment, sendEmailUpdateAppoitment, sendEmailCanceledAppoitment } from "../emails/appoitmentEmailService.js";

const createAppoitment = async (req, res) => {
  const appoitment = req.body
  appoitment.user = req.user._id.toString() // de esta manera se guarda el id del usuario para que sea la refenrencia de la cita, esto es lo que se debe cambiar para tener tambien como referencia el email del usuario
  try {
    const newAppoitment = new Appoitment(appoitment)
    const result = await newAppoitment.save()
    await sendEmailNewAppoitment({
      date: formatDate(result.date),
      time: result.time
    })
    res.json({msg: 'Cita Creada'})
  } catch (error) {
    console.log(error);
  }
}

const getAppoitmentsById = async (req, res) => {
  const { id } = req.params
  if (validateObjectId(id, res)) return

  const appoitment = await Appoitment.findById(id).populate('services')

  if(!appoitment) {
    return handleNotFoundError('La Cita no existe', res)
  }
  if (appoitment.user.toString() !== req.user._id.toString()){
    const error = new Error('No tienes acceso')
    return res.status(403).json({msg: error.message})
  }
  res.json(appoitment)
}

const getAppoitmentsBydate = async (req, res) => {
  try {
    const { date } = req.query

    console.log('this is the date', date)
    const newDate = parse(date, 'dd/MM/yyyy', new Date())
    const startDate = startOfDay(newDate).toISOString();
    const endDate = endOfDay(newDate).toISOString();

    console.log("Inicio del día (UTC):", startDate);
    console.log("Fin del día (UTC):", endDate);

    const appoitments = await Appoitment.find({ date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    }})
    // const appoitments = await Appoitment.find({ date: {
    //   $gt : date
    // }})
    console.log(appoitments)
    res.json(appoitments)
  } catch (error) {
    console.log("date format not valid",error)
  }
}

const updateAppoitment = async(req, res) => {
  const { id } = req.params
  if (validateObjectId(id, res)) return

  const appoitment = await Appoitment.findById(id).populate('services')

  if(!appoitment) {
    return handleNotFoundError('La Cita no existe', res)
  }
  if (appoitment.user.toString() !== req.user._id.toString()){
    const error = new Error('No tienes acceso')
    return res.status(403).json({msg: error.message})
  }
  const { date, time, totalAmount, services } = req.body
  appoitment.date = date
  appoitment.time = time
  appoitment.totalAmount = totalAmount
  appoitment.services = services
  try {
    const result = await appoitment.save()
    await sendEmailUpdateAppoitment({
      date: formatDate(result.date),
      time: result.time
    })
    res.json({
      msg: 'Cita actualizada correctamente'
    })
  } catch (error) {
    console.log(error)
  }
}

const deleteAppoitment = async(req, res) => {
  const { id } = req.params
  if (validateObjectId(id, res)) return

  const appoitment = await Appoitment.findById(id).populate('services')

  if(!appoitment) {
    return handleNotFoundError('La Cita no existe', res)
  }
  if (appoitment.user.toString() !== req.user._id.toString()){
    const error = new Error('No tienes acceso')
    return res.status(403).json({msg: error.message})
  }
  try {
    const result = await appoitment.deleteOne()
    await sendEmailCanceledAppoitment({
      date: formatDate(appoitment.date),
      time: appoitment.time
    })
    res.json({
      msg: 'Cita Cancelada'
    })
  } catch (error) {
    console.log(error)
  }
}

export {
  createAppoitment,
  getAppoitmentsBydate,
  getAppoitmentsById,
  updateAppoitment,
  deleteAppoitment
}
