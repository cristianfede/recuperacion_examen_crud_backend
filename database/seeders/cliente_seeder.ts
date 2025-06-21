// database/seeders/cliente_seeder.ts
import Cliente from '#models/cliente'
import { faker } from '@faker-js/faker'

export default class ClienteSeeder {
  public async run() {
    const clientes = []

    for (let i = 0; i < 20; i++) {
      clientes.push({
        nombre: faker.person.fullName(),
        email: faker.internet.email(),
      })
    }

    await Cliente.createMany(clientes)
  }
}
