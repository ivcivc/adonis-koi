'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GrupoSchema extends Schema {
  up () {
    this.create('grupos', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('grupos')
  }
}

module.exports = GrupoSchema
