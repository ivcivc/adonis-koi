'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Participante extends Model {
  pessoa () {
    return this.belongsTo('App/Models/Pessoa', 'pessoa_id', 'id')
  }
  evento () {
    return this.belongsTo('App/Models/Evento', 'evento_id', 'id')
  }

  /* participante () {
    return this.belongsTo('App/Models/Participante')
  } */

  consultor () {
    return this.belongsTo('App/Models/Pessoa', 'consultor_id')
  }
}

module.exports = Participante
