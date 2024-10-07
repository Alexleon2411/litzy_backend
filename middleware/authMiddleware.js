import jwt from 'jsonwebtoken'
import User from '../models/User.js'


const authMiddleware = async (req, res, next) => {

  if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const toke = req.headers.authorization.split(' ')[1] // ya que srecibirmos Bearer al principio del token entonces lo dividimos por el espacio que contiene y ya despues tomamos el token que se encuentra en la posicion 1 del array
      const decoded = jwt.verify(toke, process.env.JWT_SECRET ) /// para verificar que el token es correcto, el primer parametro es el token y el segundo es el secreto que usamos para generar ese token
      req.user = await User.findById(decoded.id).select(
        "-password -verified -token -__v" // de esta manera omitimos recibir las columnas mencionadas anteriormente
      )
      next()// con next le decimos que ya deberia de ejecutar la siguiente funcion que esta disponible
    } catch  {
      const error = new Error('Token no valido ')
      res.status(403).json({msg: error.message})
    }
  }else{
    const error = new Error('Token no valido o inexistente')
    res.status(403).json({msg: error.message})
  }

}

export default authMiddleware
