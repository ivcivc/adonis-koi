'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReceberSchema extends Schema {
  up () {
    this.create('recebers', table => {
      table.increments()
      table
        .string('periodicity', 10)
        .notNullable()
        .default('monthy')
      table.string('quantity', 2).notNullable()
      table.date('dateFirst').notNullable()
      table.string('status', 15).notNullable()
      table.string('statusDescription')
      table.string('link')
      table.float('value').default(0.0)
      table.string('brand', 15)
      table.string('operator', 10)
      table.string('operatorName', 20)

      table
        .integer('evento_id')
        .unsigned()
        .references('id')
        .inTable('eventos')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')

      table
        .integer('pessoa_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('pessoas')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')

      table
        .integer('contaReceber_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('conta_recebers')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')

      table.timestamps()
    })
  }

  down () {
    this.drop('recebers')
  }
}

module.exports = ReceberSchema
