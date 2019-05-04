'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Endereco extends Model {
  pessoa () {
    return this.belongsTo('App/Models/Pessoa')
  }
}

module.exports = Endereco
