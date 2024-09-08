import mongoose from 'mongoose'
import colors from 'colors'


export const db = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL)
    const url = `${db.connection.host}:${db.connection.port}`
    console.log(colors.cyan('se conecto correctamente', url))
  } catch (error) {
    console.log(`error: ${error.message}`)
    process.exit(1)// este process.exit(1) finaliza la ejecucion de nuestro programa y finaliza el mismo.. para finaliza un programa con todo bien se utiliza exit(0) pero para un error se utiliza el 1
  }
}
