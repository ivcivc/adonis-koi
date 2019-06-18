'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContaReceberSchema extends Schema {
  up () {
    this.create('conta_recebers', table => {
      table.increments()
      table
        .string('nome', 30)
        .notNullable()
        .unique()

      table.string('status', 10).notNullable()
      table.boolean('auto').default(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('conta_recebers')
  }
}

module.exports = ContaReceberSchema
