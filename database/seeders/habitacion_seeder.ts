// database/seeders/habitacion_seeder.ts
import Habitacion from '#models/habitacion'
import { faker } from '@faker-js/faker'

export default class HabitacionSeeder {
  public async run() {
    const habitaciones = []

    for (let i = 0; i < 20; i++) {
      habitaciones.push({
        numero: 100 + i, // Para que no se repitan
        tipo: faker.helpers.arrayElement(['Individual', 'Doble', 'Suite']),
        precio: faker.number.int({ min: 80, max: 300 }),
        disponible: true,
      })
    }

    await Habitacion.createMany(habitaciones)
  }
}
