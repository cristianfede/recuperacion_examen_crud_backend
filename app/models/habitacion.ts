// app/Models/Habitacion.ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Reserva from './reserva.js'
import { DateTime } from 'luxon'

export default class Habitacion extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare numero: number

  @column()
  declare tipo: string

  @column()
  declare precio: number

  @column()
  declare disponible: boolean

  @hasMany(() => Reserva)
  declare reservas: HasMany<typeof Reserva>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
