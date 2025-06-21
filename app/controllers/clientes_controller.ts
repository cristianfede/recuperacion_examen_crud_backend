// app/Controllers/Http/ClientesController.ts
import type { HttpContext } from '@adonisjs/core/http'
import Cliente from '#models/cliente'

export default class ClientesController {
  async index() {
    return await Cliente.all()
  }

  async store({ request }: HttpContext) {
    const data = request.only(['nombre', 'email', 'telefono'])
    return await Cliente.create(data)
  }

  async show({ params }: HttpContext) {
    return await Cliente.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const cliente = await Cliente.findOrFail(params.id)
    cliente.merge(request.only(['nombre', 'email', 'telefono']))
    await cliente.save()
    return cliente
  }

  async destroy({ params }: HttpContext) {
    const cliente = await Cliente.findOrFail(params.id)
    await cliente.delete()
    return { message: 'Cliente eliminado correctamente' }
  }
}
