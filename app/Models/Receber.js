'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Receber extends Model {
  pessoa () {
    return this.belongsTo('App/Models/Pessoa', 'pessoa_id')
  }
  /* evento () {
    return this.belongsTo('App/Models/Evento', 'evento_id')
  } */
  participante () {
    return this.belongsTo('App/Models/Participante', 'participante_id')
  }

  contaReceber () {
    return this.belongsTo('App/Models/ContaReceber', 'contaReceber_id')
  }

  receberItems () {
    return this.hasMany('App/Models/ReceberItem')
    // return this.belongsToMany('App/Models/ReceberItem')
  }
}

module.exports = Receber
