// app/Controllers/Http/HabitacionsController.ts
import type { HttpContext } from '@adonisjs/core/http'
import Habitacion from '#models/habitacion'

export default class HabitacionsController {
  async index() {
    return await Habitacion.all()
  }

  async store({ request }: HttpContext) {
    const data = request.only(['numero', 'tipo', 'precio', 'disponible'])
    return await Habitacion.create(data)
  }

  async show({ params }: HttpContext) {
    return await Habitacion.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const habitacion = await Habitacion.findOrFail(params.id)
    habitacion.merge(request.only(['numero', 'tipo', 'precio', 'disponible']))
    await habitacion.save()
    return habitacion
  }

  async destroy({ params }: HttpContext) {
    const habitacion = await Habitacion.findOrFail(params.id)
    await habitacion.delete()
    return { message: 'Habitación eliminada correctamente' }
  }
}
