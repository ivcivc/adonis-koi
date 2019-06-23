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
        .notNullable()
        .references('id')
        .inTable('eventos')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table
        .integer('pessoa_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('pessoas')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')

      table
        .integer('consultor_id')
        .unsigned()
        .default(null)
        .references('id')
        .inTable('pessoas')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')

      table
        .boolean('treinamentoConcluido')
        .notNullable()
        .default(false)

      table.integer('parcelas')
      table.float('valorBase', 8, 2)

      table
        .boolean('pagarConsultor')
        .notNullable()
        .default(false)
      table.float('percentConsultor', 8, 2)
      table.float('valorConsultor', 8, 2)

      table
        .string('status', 10)
        .notNullable()
        .default('ATIVO')

      table
        .integer('tipoNegociacao_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tipo_negociacaos')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')

      table.timestamps()
    })
  }

  down () {
    this.drop('participantes')
  }
}

module.exports = ParticipantesSchema
