'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TipoNegociacaoSchema extends Schema {
  up () {
    this.create('TipoNegociacaos', table => {
      table.increments()

      table
        .string('nome', 30)
        .notNullable()
        .unique()

      table.timestamps()
    })
  }

  down () {
    this.drop('TipoNegociacaos')
  }
}

module.exports = TipoNegociacaoSchema
