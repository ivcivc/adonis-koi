'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Grupo extends Model {
  pessoas () {
    return this.belongsToMany('App/Models/Pessoa').pivotMotdel(
      'App/Models/PessoaGrupo'
    )
  }
}

module.exports = Grupo
