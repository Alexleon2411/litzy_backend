import mongoose from "mongoose"
import jwt from 'jsonwebtoken'

function validateObjectId(id, res){
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('El ID no es valido ')
    return res.status(400).json({
      msg: error.message
    })
  }
}

function handleNotFoundError(res, message) {
  const error = new Error(message)
    return res.status(404).json({
      msg: error.message
    })
}

//para crear un token unico que llamaremos desde el modelo de usuario
const uniqueId = () => Date.now().toString(32) + Math.random().toString(32).substring(2)

  const generateJWT = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '2d'
    })
    return token
  }

export {
  validateObjectId,
  handleNotFoundError,
  uniqueId,
  generateJWT
}
