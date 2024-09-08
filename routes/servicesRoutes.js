import { Router } from "express";
import { getServices, createService, getService, updateService, deleteService } from "../controllers/ServicesController.js";


const router = Router()

// para obtener los serivicios, no se llama a la funcion con parentesis porque no es necesario, solo se pasa como parametro en el router y listo
/*esta es la forma antigua de configurar nuestro router
router.post('/', createService)
router.get('/', getServices)
router.get('/:id', getService)
router.put('/:id', updateService)
router.delete('/:id', deleteService)
*/

// la siguiente es la forma actual de configurar nuestro router
router.route('/')
  .post(createService)
  .get(getServices)

router.route('/:id')
  .get(getService)
  .put(updateService)
  .delete(deleteService)

export default router
