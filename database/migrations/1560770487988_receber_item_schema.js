'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReceberItemSchema extends Schema {
  up () {
    this.create('receber_items', table => {
      table.increments()
      table.date('payDay').notNullable()
      table.integer('installmentNumber').notNullable()
      table.string('tid', 30)
      table.string('additionalInfo').default(null)
      table.string('paymentBillInternalId')
      table.string('paymentBillIntegrationId')
      table.string('paymentBillAdditionalInfo')
      table.float('value').default(0.0)
      table.string('authorizationCode')
      table.date('lastUpdateDate')
      table.string('status', 20).notNullable()
      table.string('statusDescription')
      table.string('brand', 15)
      table.string('truncatedNumber', 20)
      table.string('cardInternalId')
      table
        .integer('receber_id')
        .unsigned()
        .references('id')
        .inTable('recebers')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')

      table.timestamps()

      // alter table
    })
  }

  down () {
    this.table('receber_items', table => {
      // reverse alternations
    })
  }
}

module.exports = ReceberItemSchema
