import serviceModel from "../models/Service.js";
import { handleNotFoundError, validateObjectId } from "../utils/index.js";


const createService = async (req, res) => {
  if(Object.values(req.body).includes('')) {
    const error = new Error('todos los campos son obligatorios')
    return res.status(400).json({
      msg: error.message
    })
  }
  try {
    // se toma el modelo de servicios y de esta manera se dan las especificaciones necesarias para crear un servicio
    const service = new serviceModel(req.body)
    // de la siguiente manera se puede guardar en la base de datos
    await service.save()
    // esta es la respuesta que se enviara al usuario en el frontend
    res.json({
      msg: 'el servicio se creo correctamente'
    })
  } catch (error) {
    console.log(error)
  }
}
const getServices = async (req, res) => {
  try {
    const services = await serviceModel.find()
    res.json(services)
  } catch (error) {
    console.log(error)
  }
}
const getFilteredServices = async (req, res) => {
  try {
    const category = req.query.category;  // Lee la categoría de los parámetros de consulta
    const services = await serviceModel.find({ category: category });
    res.json(services);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching services' });
  }
};

const getService = async (req, res) => {
  // validar un objectID ya que mongo maneja objectsID no Id como sql
  const { id } =  req.params // se utiliza destrochoring para que extraiga el valor del parametro sino la valiable seria igual a el id con el valor que contiene el id del parametro
  if (validateObjectId(id, res)) return // se configura el validateObject de la siguiente manera para si existe un error en la funcion validate corte la ejecucion del resto de la funcion
  // validar que el servicio exista
  const service = await serviceModel.findById(id)
  if (!service) {
    return handleNotFoundError(res, 'El servicio no existe') // de esta manera se puede enviar un mensaje personalizado para manejar los error que presenta la funcion
  }
  // mostrar el servicio
  res.json(service)
}

const updateService =  async (req, res) => {
  const { id } =  req.params // se utiliza destrochoring para que extraiga el valor del parametro sino la valiable seria igual a el id con el valor que contiene el id del parametro
  if (validateObjectId(id, res)) return
  // validar que el servicio exista
  const service = await serviceModel.findById(id)
  if (!service) {
    return handleNotFoundError(res, 'El servicio no existe')
  }
  // escribimos en el objeto los valores nuevos
  service.name = req.body.name || service.name // si el nombre no se esta actualizando entonces le damos el valor de name anterior
  service.image = req.body.image || service.image // si el nombre no se esta actualizando entonces le damos el valor de name anterior
  service.description = req.body.description || service.description // si el nombre no se esta actualizando entonces le damos el valor de name anterior
  service.duration = req.body.duration || service.duration // si el nombre no se esta actualizando entonces le damos el valor de name anterior
  service.price = req.body.price || service.price
  service.category = req.body.category || service.category
  try {
    await service.save() // de esta manera se guardaran los cambios en la base de datos
    res.json({
      msg: 'El servicio se ha actualizado correctamente'
    })
  } catch (error) {
    console.log(error)
  }
}

const deleteService = async (req, res) => {
  const { id } = req.params
  // validar el id
  if (validateObjectId(id, res)) return
  // validar que existe el servicio
  const service = await serviceModel.findById(id)
  if(!service) {
    return handleNotFoundError(res, 'El servicio no existe')
  }
  try {
    await service.deleteOne()
    res.json({
      msg: 'El servicio se ha eliminado correctamente'
    })
  } catch (error) {
    console.log(error)
  }
}

export {
  createService,
  getServices,
  getFilteredServices,
  getService,
  updateService,
  deleteService
}
