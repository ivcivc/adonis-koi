'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PessoaGrupo extends Model {
  pessoa () {
    return this.belongsTo('App/models/Pessoa')
  }
}

module.exports = PessoaGrupo
