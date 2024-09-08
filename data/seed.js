import { db } from '../config/db.js'
import dotenv from 'dotenv'
import Services from '../models/Service.js'
import { services } from './beutyServices.js'
import colors from 'colors'
// debido a que la conexion a la base de datos se encuentra en una variable de entorno entonces se debe importar dotenv
dotenv.config()
// y de esta manera se llama la conexion a la base de datos.
 await db()

async function seedDB() {
  try {
    await Services.insertMany(services)
    console.log(colors.green.bold('se agregaron los datos correcatamente'))
    process.exit(0)
  } catch (error) {
    console.log(colors.red.bold(error))
    process.exit(1)
  }
}

async function clearDB() {
  try {
    await Services.deleteMany()
    console.log(colors.red.bold('se eliminaron los datos'))
    process.exit()
  } catch (error) {
    console.log(colors.red.bold(error))
    process.exit(1)
  }
}


if (process.argv[2] === '--import') {
  seedDB()
}else {
  clearDB()
}
