// app/Controllers/Http/ReservasController.ts
import type { HttpContext } from '@adonisjs/core/http'
import Reserva from '#models/reserva'
import db from '@adonisjs/lucid/services/db'

export default class ReservasController {
  // Listar todas las reservas con datos completos
  async index() {
    return await Reserva.query().preload('cliente').preload('habitacion')
  }

  // Crear una reserva evitando superposición de fechas
  async store({ request, response }: HttpContext) {
    // Obtenemos el payload desde el request (formato snake_case)
    const payload = request.only(['cliente_id', 'habitacion_id', 'fecha_inicio', 'fecha_fin'])

    // Mapeamos al formato camelCase que espera el modelo
    const data = {
      clienteId: payload.cliente_id,
      habitacionId: payload.habitacion_id,
      fechaInicio: payload.fecha_inicio,
      fechaFin: payload.fecha_fin,
    }

    // Verificamos si existen reservas superpuestas en las mismas fechas para la misma habitación
    const reservasSuperpuestas = await db
      .from('reservas')
      .where('habitacion_id', data.habitacionId)
      .where('estado', 'confirmada')
      .whereRaw(
        `(fecha_inicio <= ? AND fecha_fin >= ?)
         OR (fecha_inicio <= ? AND fecha_fin >= ?)
         OR (fecha_inicio >= ? AND fecha_fin <= ?)`,
        [
          data.fechaFin,
          data.fechaFin,
          data.fechaInicio,
          data.fechaInicio,
          data.fechaInicio,
          data.fechaFin,
        ]
      )

    if (reservasSuperpuestas.length > 0) {
      return response.badRequest({ message: 'La habitación ya está reservada en esas fechas.' })
    }

    // Creamos la reserva porque no hay conflicto
    const reserva = await Reserva.create(data)
    return response.created(reserva)
  }

  // Mostrar una reserva específica con sus relaciones
  async show({ params, response }: HttpContext) {
    try {
      const reserva = await Reserva.query()
        .where('id', params.id)
        .preload('cliente')
        .preload('habitacion')
        .firstOrFail()

      return reserva
    } catch (error) {
      return response.notFound({ message: 'Reserva no encontrada' })
    }
  }

  // Actualizar el estado de una reserva (confirmada, cancelada, finalizada)
  async update({ params, request, response }: HttpContext) {
    try {
      const reserva = await Reserva.findOrFail(params.id)
      const { estado } = request.only(['estado'])

      // Opcional: puedes validar aquí que solo se permitan los estados válidos
      if (!['confirmada', 'cancelada', 'finalizada'].includes(estado)) {
        return response.badRequest({ message: 'Estado inválido' })
      }

      reserva.estado = estado
      await reserva.save()
      return reserva
    } catch (error) {
      return response.notFound({ message: 'Reserva no encontrada' })
    }
  }

  // Eliminar una reserva
  async destroy({ params, response }: HttpContext) {
    try {
      const reserva = await Reserva.findOrFail(params.id)
      await reserva.delete()
      return { message: 'Reserva eliminada correctamente' }
    } catch (error) {
      return response.notFound({ message: 'Reserva no encontrada' })
    }
  }
}
