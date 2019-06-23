'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Participante extends Model {
  pessoa () {
    return this.belongsTo('App/models/Pessoa', 'pessoa_id')
  }
  evento () {
    return this.belongsToMany('App/models/Evento')
  }
  /*
  participante () {
    return this.belongsTo('App/models/Participante')
  }

  consultor () {
    return this.belongsTo('App/models/Pessoa', 'consultor_id')
  } */
}

module.exports = Participante
