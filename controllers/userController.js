import Appoitment from "../models/Appoitment.js"

const getUserAppoitments = async(req, res) => {
  const { user } = req.params
  const currentDate = new Date();

  if (user !== req.user._id.toString() && req.user.admin === false){
    const error = new Error('Acceso denegado')
    return res.status(400).json({msg: error.message})
  }
  try {
    const query = req.user.admin ? { date: { $gte : new Date() } } : { user, date: { $gte : new Date() } }
    const appointments = await Appoitment
                                .find(query)
                                .populate('services')
                                .populate({path: 'user', select: 'name email'})
                                .sort({date: 'asc'})
    res.json(appointments)
  } catch (error) {
    console.log(error)
  }
}


export {
  getUserAppoitments,
}
