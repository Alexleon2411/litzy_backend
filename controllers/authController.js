import User from '../models/User.js'
import { sendEmailVerification, sendEmailPasswordReset } from '../emails/authEmails.js'
import { generateJWT, uniqueId } from '../utils/index.js'

const register = async (req, res) => {
  //valida todos los campos
  if (Object.values(req.body).includes('')){
    const error = new Error('todos los campos son obligatorios')
    return res.status(400).json({
      msg: error.message
    })
  }
  //evitar registros duplicados
  const { email, password, name } = req.body
  const userExists = await User.findOne({ email })
  if (userExists){
    const error = new Error('Este usuario ya existe')
    return res.status(400).json({
      msg: error.message
    })
  }
  //valida la extension del password
  const MIN_PASSWORD_LENGTH = 8
  if (password.trim().length < MIN_PASSWORD_LENGTH){
    const error = new Error(`La contraseña debe tener almenos ${MIN_PASSWORD_LENGTH} caracteres`)
    return res.status(400).json({
      msg: error.message
    })
  }
  try {
    const user = new User(req.body)
    const result = await user.save() // se guarda el resultado del usuario creadp
    const {name, email, token } = result // se extraen los siguientes valores para enviarlos por email al usuario
    sendEmailVerification({name, email, token}) // se llama a la funcion encargada de enviar el email
    res.json({
      msg: 'El usuario Se ha creado correctamente, revisa tu email'
    })
  } catch (error) {
    console.log(error);
  }
}

const verifyAccount = async (req, res) => {
  const { token } = req.params
  const user = await User.findOne({token})
  // si el toke no es valido envair error
  if(!user){
    const error = new Error('hubo un error, token invalido');
    return res.status(401).json({msg: error.message})
  }
  // si el token es valido, confirmar la cuenta
  try {
    user.verified = true // forma de verificar el usuario
    user.token = '' // se elimina el token para que no se pueda reutilizar
    await user.save() // se gaurdan los cambios
    res.json({msg: 'Usuario confirmado correctamente'})
  } catch (error) {

  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  //revsiar que el usuario existe
  const user = await User.findOne({email})
  // si el toke no es valido envair error
  if(!user){
    const error = new Error('El usuario no existe');
    return res.status(401).json({msg: error.message})
  }
  //verificar que el usuario confirmo su cuenta
  if (!user.verified){
    const error = new Error('Tu cuenta no ha sido confirmada aun');
    return res.status(401).json({msg: error.message})
  }
  // comprobar el password
  if(await user.checkPassword(password)){
    const token = generateJWT(user._id);
    res.json({token});
  }else{
    const error = new Error('La contraseña es incorrecta');
    return res.status(401).json({msg: error.message})
  }
}

const forgotPassword = async (req, res) => {
  const  email  = req.body._value
  const user = await User.findOne({email})
  if (!user){
    const error = new Error('El usuario no existe ');
    return res.status(404).json({msg: error.message})
  }
  try {
    user.token = uniqueId()
    const result = await user.save()
    await sendEmailPasswordReset({
      name: result.name,
      email: result.email,
      token: result.token
    })
    res.json({
      msg: 'Hemos enviado un email con las instrucciones'
    })
  } catch (error) {
    console.log(error)
  }
}

const verifyPasswordResetToken = async (req, res) => {
  const { token } = req.params
  const validToken = await User.findOne({token})

  if(!validToken){
    const error = new Error('token no valido');
    return res.status(400).json({msg: error.message})

  }
  res.json({msg: 'token valido'})
}
const updatePassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body
  console.log(req.body)
  const user = await User.findOne({token})

  if(!user){
    const error = new Error('token no valido');
    return res.status(400).json({msg: error.message})

  }

  try {
    user.token = ''
    user.password = password
    await user.save()
    res.json({
      msg: 'contraseña Modificada'
    })
  } catch (error) {
    console.log(error)
  }
}

const user = async (req, res) => {
  const { user } = req // de esta manera se mantiene la sesion del usuario y se le puede dar acceso a los datos requeridos
  res.json(
    user // y de esta manera estariamos respondiendo con el usuario en cuestion
  )
}
const admin = async (req, res) => {
  const { user } = req // de esta manera se mantiene la sesion del usuario y se le puede dar acceso a los datos requeridos
  if(!user.admin){
    const error = new Error('Accion no valida')
    return res.status(403).json({msg: error.message})
  }
  res.json(
    user // y de esta manera estariamos respondiendo con el usuario en cuestion
  )
}

const getUser = async (req, res) => {
  const {id} = req.params
  const { user } = req
  if( !user.admin) {
    const error = new Error('accion no valida')
    return res.status(403).json({msg: error.message})
  }
  const searchedUser = await User.findById(id)
  res.json(searchedUser)
}

export {
  register,
  verifyAccount,
  login,
  forgotPassword,
  verifyPasswordResetToken,
  updatePassword,
  user,
  admin,
  getUser,
}
