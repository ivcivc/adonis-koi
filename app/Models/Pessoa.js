'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pessoa extends Model {
  endereco () {
    return this.hasOne('App/Models/Endereco')
  }

  grupos () {
    return this.hbelongsToasOne('App/Models/Grupo')
  }
}

module.exports = Pessoa
