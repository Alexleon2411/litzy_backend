import  express from 'express' //ESM
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import { db } from './config/db.js'
import servicesRoutes from './routes/servicesRoutes.js'
import authRoutes from './routes/authRoutes.js'
import appoitmentRoutes from './routes/appoitmentRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

// configurar la aplicacion
const app = express()

// leer datos via body
app.use(express.json())

//conectar a base de datos
db()

// configurar cors
const whiteList = [process.env.FRONTEND_URL, undefined]

const corsOptions = {
  origin: function(origin, callback) {
    if (whiteList.includes(origin)) {
      //permitir la conexion
      callback(null, true)
    }else {
      //no permitir la conexion
      callback(new Error('error de cors'))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))


//definit ruta
app.use('/api/services', servicesRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/appoitments', appoitmentRoutes)
app.use('/api/users', userRoutes)



// definir puerto
const PORT = process.env.PORT || 4000
// arracar la app
app.listen(PORT, () => {
  console.log(colors.blue('el servidor se esta ejecutando en el puerto:', colors.bold(PORT)))
})
