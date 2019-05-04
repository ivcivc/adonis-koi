'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EnderecoPessoaSchema extends Schema {
  up () {
    this.create('enderecos', table => {
      table.increments()
      table.string('logradouro', 50).notNullable()

      table.string('nr', 10).notNullable()

      table.string('compl', 15).notNullable()

      table.string('bairro', 20).notNullable()

      table.string('cidade', 20).notNullable()

      table.string('estado', 2).notNullable()

      table.string('cep', 8).notNullable()

      table
        .integer('pessoa_id')
        .unsigned()
        .index()
      table
        .foreign('pessoa_id')
        .references('id')
        .on('pessoas')
        .onDelete('cascade')
        .onUpdate('cascade')

      table.timestamps()
    })
  }

  down () {
    this.drop('enderecos')
  }
}

module.exports = EnderecoPessoaSchema
