'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProspeccaoSchema extends Schema {
  up () {
    this.create('prospeccaos', table => {
      table.string('Text', 30).notNullable()

      table.string('Description')

      table.datetime('StartDate')
      table.datetime('EndDate')

      table.boolean('AllDay')

      table.text('RecurrenceRule')

      table.string('Padrinho', 30)
      table.string('Consultor', 30)

      table.string('Celular', 15)
      table.text('Email')

      table
        .string('Situacao', 12)
        .notNullable()
        .default('ABERTO')

      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('prospeccaos')
  }
}

module.exports = ProspeccaoSchema
