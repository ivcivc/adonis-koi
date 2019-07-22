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

      table
        .integer('local_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('locals')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')

      table
        .integer('treinamento_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('treinamentos')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')

      table.date('dInicio')
      table.date('dTermino')

      table.float('valorBase').default(0.0)

      table.text('obs')

      table
        .string('siteExibir')
        .notNullable()
        .index()
      table.integer('siteParcelas')
      table.string('siteEvento').notNullable()
      table.text('siteDetalhes')
      table.text('siteLink')

      table.timestamps()
    })
  }

  down () {
    this.drop('eventos')
  }
}

module.exports = EventoSchema
