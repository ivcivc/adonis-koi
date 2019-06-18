'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Evento extends Model {
  local () {
    return this.belongsTo('App/Models/Local')
  }
  treinamento () {
    return this.belongsTo('App/Models/Treinamento')
  }

  participantes () {
    return this.hasMany('App/Models/Participante')
  }
}

module.exports = Evento
