// start/routes.ts
import router from '@adonisjs/core/services/router'

const ClientesController = () => import('#controllers/clientes_controller')
const HabitacionsController = () => import('#controllers/habitacions_controller')
const ReservasController = () => import('#controllers/reservas_controller')
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Este es el grupo de rutas, va por fuera
router
  .group(() => {
    router.resource('clientes', ClientesController).apiOnly()
    router.resource('habitaciones', HabitacionsController).apiOnly()
    router.resource('reservas', ReservasController).apiOnly()
  })
  .prefix('/api')
