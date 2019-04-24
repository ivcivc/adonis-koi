'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ParticipantesSchema extends Schema {
  up () {
    this.create('participantes', table => {
      table.increments()

      table
        .integer('evento_id')
        .unsigned()
        .references('id')
        .inTable('eventos')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('pessoa_id')
        .unsigned()
        .references('id')
        .inTable('pessoas')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')

      table
        .integer('consultor_id')
        .unsigned()
        .references('id')
        .inTable('pessoas')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')

      table.boolean('pagarConsultor').notNullable()
      table
        .boolean('TreinamentoConcluido')
        .notNullable()
        .default(false)

      table.decimal('parcelas', 2)
      table.float('total', 8, 2)

      table
        .integer('TipoNegociacao_id')
        .unsigned()
        .references('id')
        .inTable('TipoNegociacaos')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')

      table.timestamps()
    })
  }

  down () {
    this.drop('participantes')
  }
}

module.exports = ParticipantesSchema
