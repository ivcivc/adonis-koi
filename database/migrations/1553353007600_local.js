'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LocalSchema extends Schema {
  up () {
    this.create('locals', table => {
      table.increments()

      table
        .string('nome', 30)
        .notNullable()
        .unique()

      table.string('status', 10).notNullable()
      table.string('contato', 20)

      table.string('tel_com', 11)

      table.string('tel_com2', 11)

      table.string('tel_celular', 11)

      table.string('tel_celular2', 11)

      table.string('email')

      table.string('logradouro', 50)
      table.string('compl', 15)
      table.string('bairro', 20)
      table.string('cidade', 20)
      table.string('estado', 2)
      table.string('cep', 8)

      table.string('nota', 8)

      table.timestamps()
    })
  }

  down () {
    this.drop('locals')
  }
}

module.exports = LocalSchema
