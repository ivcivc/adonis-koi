'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Receber extends Model {
  pessoa () {
    return this.belongsTo('App/models/Pessoa', 'pessoa_id')
  }
  evento () {
    return this.belongsTo('App/models/Evento', 'evento_id')
  }

  contaReceber () {
    return this.belongsTo('App/models/ContaReceber', 'contaReceber_id')
  }

  receberItems () {
    return this.hasMany('App/Models/ReceberItem')
  }
}

module.exports = Receber
