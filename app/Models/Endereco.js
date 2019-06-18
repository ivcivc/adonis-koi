'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Endereco extends Model {
  static get hidden () {
    return ['']
  }
  pessoa () {
    return this.belongsTo('App/Models/Pessoa', 'pessoa_id', 'id')
  }
}

module.exports = Endereco
