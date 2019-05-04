'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventoSchema extends Schema {
  up () {
    this.create('eventos', table => {
      table.increments()

      table
        .string('nome', 30)
        .notNullable()
        .unique()

      table.string('status', 10).notNullable()
      table.decimal('capacidade', 3)

      table
        .integer('local_id')
        .unsigned()
        .references('id')
        .inTable('locals')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')

      table
        .integer('treinamento_id')
        .unsigned()
        .references('id')
        .inTable('treinamentos')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')

      table.date('dInicio')
      table.date('dTermino')

      table.float('valorBase').default(0.0)

      table.text('obs')

      table.timestamps()
    })
  }

  down () {
    this.drop('eventos')
  }
}

module.exports = EventoSchema
