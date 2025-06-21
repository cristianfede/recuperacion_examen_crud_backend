// database/seeders/reserva_seeder.ts
import Reserva from '#models/reserva'
import { DateTime } from 'luxon'
import { faker } from '@faker-js/faker'

export default class ReservaSeeder {
  public async run() {
    const reservas = []

    for (let i = 0; i < 20; i++) {
      const fechaInicio = faker.date.soon({ days: 30 })
      const fechaFin = faker.date.soon({ days: 10, refDate: fechaInicio })

      reservas.push({
        clienteId: faker.number.int({ min: 1, max: 20 }),
        habitacionId: faker.number.int({ min: 1, max: 20 }),
        fechaInicio: DateTime.fromJSDate(fechaInicio),
        fechaFin: DateTime.fromJSDate(fechaFin),
        estado: faker.helpers.arrayElement(['confirmada', 'cancelada', 'finalizada']),
      })
    }

    await Reserva.createMany(reservas)
  }
}
