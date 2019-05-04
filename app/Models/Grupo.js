'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Grupo extends Model {
  pessoas () {
    return this.belongsToMany('App/models/Pessoa').pivotMotdel(
      'App/models/PessoaGrupo'
    )
  }
}

module.exports = Grupo
