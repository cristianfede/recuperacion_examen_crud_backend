// database/migrations/{fecha}_reservas.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('cliente_id')
        .unsigned()
        .references('id')
        .inTable('clientes')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('habitacion_id')
        .unsigned()
        .references('id')
        .inTable('habitacions')
        .onDelete('CASCADE')
        .notNullable()

      table.date('fecha_inicio').notNullable()
      table.date('fecha_fin').notNullable()

      table
        .enum('estado', ['confirmada', 'cancelada', 'finalizada'])
        .notNullable()
        .defaultTo('confirmada')

      table.timestamps(true) // created_at y updated_at
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
