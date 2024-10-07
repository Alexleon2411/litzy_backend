import Appoitment from "../models/Appoitment.js"

function formatDateToCustomString(date) {
  // esta  funcion se utiliza para formatear la fecha de hoy en el formato en el que esta guardada la fecha en mongoBD YYYY/DD/MM
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, '0'); // Asegúrate de que tenga dos dígitos
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados, así que sumamos 1

  return `${year}/${day}/${month}`; // Devuelve la fecha en el formato YYYY/DD/MM
}

const getUserAppoitments = async(req, res) => {
  const { user } = req.params
  const currentDate = new Date();

  if (user !== req.user._id.toString() && req.user.admin === false){
    const error = new Error('Acceso denegado')
    return res.status(400).json({msg: error.message})
  }
  try {
    const appoitments = await Appoitment.find({
      user,
      date: {
        $gte: formatDateToCustomString(currentDate)
      }
    }).populate('services').sort({date: 1})
    console.log(appoitments)
    res.json(appoitments)

  } catch (error) {
    console.log(error)
  }
}


export {
  getUserAppoitments,
}
