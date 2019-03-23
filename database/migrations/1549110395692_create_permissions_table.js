'use strict'

const Schema = use('Schema')

class PermissionsTableSchema extends Schema {
  up () {
    this.create('permissions', table => {
      table.increments()
      table
        .string('slug')
        .notNullable()
        .unique()
      table
        .string('name')
        .notNullable()
        .unique()
      table.text('description').nullable()
      table.text('class').nullable()
      table.integer('order')
      table.boolean('isActive')
      table.timestamps()
    })
  }

  down () {
    this.drop('permissions')
  }
}

module.exports = PermissionsTableSchema
