import mongoose from 'mongoose'
import { uniqueId } from '../utils/index.js' // token generado en utils
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email:{
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  token: {
    type: String,
    default: () => uniqueId() // valor por defecto es el token que hemos mandado a llamar
  },
  verified: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Boolean,
    default: false,
  }
})

// para hashear el password
userSchema.pre('save', async function ( next) {
  if(!this.isModified('password')){
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.checkPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
