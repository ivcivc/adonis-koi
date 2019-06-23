'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ReceberItem extends Model {
  receber () {
    return this.belongsTo('App/Models/Receber')
  }
}

module.exports = ReceberItem
