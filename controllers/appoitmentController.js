import Appoitment from "../models/Appoitment.js";
import { handleNotFoundError, validateObjectId } from "../utils/index.js";

const createAppoitment = async (req, res) => {
  const appoitment = req.body
  appoitment.user = req.user._id.toString() // de esta manera se guarda el id del usuario para que sea la refenrencia de la cita, esto es lo que se debe cambiar para tener tambien como referencia el email del usuario
  try {
    const newAppoitment = new Appoitment(appoitment)
    await newAppoitment.save()
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
    const dateRegex = /^([0-2][0-9]|(3)[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;

    // Verificar si la fecha sigue el formato correcto
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: 'Formato de fecha inválido. Use dd/mm/yyyy.' });
    }

    // Descomponer la fecha para validaciones adicionales
    const [day, month, year] = date.split('/').map(Number);

    // Crear un objeto de fecha con los componentes
    const dateObject = new Date(`${year}-${month}-${day}`);

    // Validar que sea una fecha válida (por ejemplo, 31/02/2023 es inválido)
    if (dateObject.getDate() !== day || dateObject.getMonth() + 1 !== month || dateObject.getFullYear() !== year) {
      return res.status(400).json({ error: 'Fecha inválida.' });
    }

    const appoitments = await Appoitment.find({date}).select(
      'time' // de esta forma se le pide solo la hora del objeto de citas
    )
    res.json(appoitments)
  } catch (error) {
    console.log(error)
  }
}

export {
  createAppoitment,
  getAppoitmentsBydate,
  getAppoitmentsById
}
