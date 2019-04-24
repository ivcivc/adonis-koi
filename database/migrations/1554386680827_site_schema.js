'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SiteSchema extends Schema {
  up () {
    this.create('sites', table => {
      table.increments()

      table.string('nome', 50).notNullable()
      table.string('consultor', 50).notNullable()
      table.string('padrinho', 50).notNullable()

      table.integer('consultor_id')
      table.integer('padrinho_id')

      table.string('cpf', 11).notNullable()

      table.string('rg', 12)

      table.string('sexo', 9).notNullable()

      table.string('profissao', 30)

      table.date('dnasc')

      table.string('tel_resid', 11)

      table.string('tel_celular', 11)

      table.string('email')

      table.string('facebook')

      table.string('instagram')

      table.string('logradouro', 50).notNullable()

      table.string('nr', 10).notNullable()

      table.string('compl', 15).notNullable()

      table.string('bairro', 20).notNullable()

      table.string('cidade', 20).notNullable()

      table.string('estado', 2).notNullable()

      table.string('cep', 8).notNullable()

      table.string('meioPagamento', 15)

      table.string('planoCode').index()
      table.string('faturaCode').index()
      table.string('faturaToken').index()
      table.string('faturaHash').index()

      table
        .integer('evento_id')
        .unsigned()
        .references('id')
        .inTable('eventos')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .notNullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('sites')
  }
}

module.exports = SiteSchema
