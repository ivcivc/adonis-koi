'use strict'

const Model = use('App/Models/Grupo')
// const Database = use('Database')

class Grupo {
  async getIdGrupoAluno (payload) {
    try {
      const query = Model.query()
      query.where('nome', 'LIKE', 'ALUNO')

      const dados = await query.fetch()
      if (dados.rows.length === 0) {
        return null
      } else {
        return dados.rows[0].id
      }
    } catch (error) {
      return null
    }
  }
}

module.exports = Grupo
