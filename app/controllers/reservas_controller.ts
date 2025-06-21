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
    const payload = request.only(['cliente_id', 'habitacion_id', 'fecha_inicio', 'fecha_fin'])

    const data = {
      clienteId: payload.cliente_id,
      habitacionId: payload.habitacion_id,
      fechaInicio: payload.fecha_inicio,
      fechaFin: payload.fecha_fin,
      estado: 'confirmada' as 'confirmada', // Aquí fuerzas el tipo literal permitido
    }

    // Validación de traslapes
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

  // Actualizar una reserva evitando traslape de fechas
  async update({ params, request, response }: HttpContext) {
    try {
      const reserva = await Reserva.findOrFail(params.id)
      const payload = request.only(['estado', 'fecha_inicio', 'fecha_fin', 'habitacion_id'])

      // Opcional: validar estado
      if (payload.estado && !['confirmada', 'cancelada', 'finalizada'].includes(payload.estado)) {
        return response.badRequest({ message: 'Estado inválido' })
      }

      // Validar traslape solo si se cambia fecha o habitación
      if (payload.fecha_inicio && payload.fecha_fin && payload.habitacion_id) {
        const reservasSuperpuestas = await db
          .from('reservas')
          .where('habitacion_id', payload.habitacion_id)
          .where('estado', 'confirmada')
          .whereNot('id', reserva.id) // Importante: excluir la reserva actual
          .whereRaw(
            `(fecha_inicio <= ? AND fecha_fin >= ?)
             OR (fecha_inicio <= ? AND fecha_fin >= ?)
             OR (fecha_inicio >= ? AND fecha_fin <= ?)`,
            [
              payload.fecha_fin,
              payload.fecha_fin,
              payload.fecha_inicio,
              payload.fecha_inicio,
              payload.fecha_inicio,
              payload.fecha_fin,
            ]
          )

        if (reservasSuperpuestas.length > 0) {
          return response.badRequest({ message: 'La habitación ya está reservada en esas fechas.' })
        }
      }

      // Actualizar campos
      reserva.merge({
        estado: payload.estado ?? reserva.estado,
        fechaInicio: payload.fecha_inicio ?? reserva.fechaInicio,
        fechaFin: payload.fecha_fin ?? reserva.fechaFin,
        habitacionId: payload.habitacion_id ?? reserva.habitacionId,
      })

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
