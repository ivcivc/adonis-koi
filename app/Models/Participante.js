'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Participante extends Model {
  pessoa () {
    return this.belongsTo('App/models/Pessoa', 'pessoa_id')
  }
  evento () {
    return this.belongsTo('App/models/Evento')
  }

  consultor () {
    return this.belongsTo('App/models/Pessoa', 'consultor_id')
  }
}

module.exports = Participante
