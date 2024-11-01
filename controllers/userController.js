import Appoitment from "../models/Appoitment.js"

const getUserAppoitments = async(req, res) => {
  const { user } = req.params
  const currentDate = new Date();
  if (user !== req.user._id.toString()){
    const error = new Error('Acceso denegado')
    return res.status(400).json({msg: error.message})
  }
  try {
    const query = req.user.admin ? { date: { $gte : currentDate } } : { user, date: { $gte : currentDate} }
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
