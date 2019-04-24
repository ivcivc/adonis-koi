'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TreinamentoSchema extends Schema {
  up () {
    this.create('treinamentos', table => {
      table.increments()

      table
        .string('nome', 30)
        .notNullable()
        .unique()
      table.string('status', 10).notNullable()
      table.float('valor', 10, 2).defaultTo(0.0)

      table.timestamps()
    })
  }

  down () {
    this.drop('treinamentos')
  }
}

module.exports = TreinamentoSchema
