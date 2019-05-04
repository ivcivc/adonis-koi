'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pessoa extends Model {
  endereco () {
    return this.hasOne('App/Models/Endereco')
  }

  grupos () {
    return this.belongsToMany('App/Models/Grupo').pivotModel(
      'App/Models/PessoaGrupo'
    )
  }

  /* user() {
    return this.belongsTo('App/Models/User')
  } */
}

module.exports = Pessoa
