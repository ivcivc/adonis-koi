'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PessoaGrupoSchema extends Schema {
  up () {
    this.create('pessoa_grupo', table => {
      table.increments()
      table
        .string('nome', 20)
        .notNullable()
        .unique()

      table
        .integer('pessoa_id')
        .unsigned()
        .references('pessoas.id')
        .onDelete('cascade')
        .index('pessoa_id')

      table
        .integer('grupo_id')
        .unsigned()
        .references('grupos.id')
        .onDelete('cascade')
        .index('grupo_id')

      table.timestamps()
    })
  }

  down () {
    this.drop('pessoa_grupos')
  }
}

module.exports = PessoaGrupoSchema
