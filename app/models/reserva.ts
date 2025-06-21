// app/Models/Reserva.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Cliente from './cliente.js'
import Habitacion from './habitacion.js'
import { DateTime } from 'luxon'

export default class Reserva extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clienteId: number

  @column()
  declare habitacionId: number

  @column.date()
  declare fechaInicio: DateTime

  @column.date()
  declare fechaFin: DateTime

  @column()
  declare estado: 'confirmada' | 'cancelada' | 'finalizada'

  @belongsTo(() => Cliente)
  declare cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => Habitacion)
  declare habitacion: BelongsTo<typeof Habitacion>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
