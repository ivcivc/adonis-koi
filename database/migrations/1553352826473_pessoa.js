'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PessoaSchema extends Schema {
  up () {
    this.create('pessoas', table => {
      table.increments()

      table.string('nome', 50).notNullable()

      table.string('certificado', 50).notNullable()

      table.string('cracha', 50).notNullable()

      table
        .string('cpf', 11)
        .notNullable()
        .unique()

      table.string('rg', 12)

      table.string('sexo', 9)

      table.string('camisa', 10)

      table.string('estado_civil', 13)

      table.string('profissao', 30)

      table.date('dnasc')

      table.string('tel_resid', 11)

      table.string('tel_com', 11)

      table.string('tel_celular', 11)

      table.string('tel_celular2', 11)

      table.string('email')

      table.string('email2')

      table.string('facebook')

      table.string('instagram')

      table.text('nota')

      table.timestamps()
    })
  }

  down () {
    this.drop('pessoas')
  }
}

module.exports = PessoaSchema
