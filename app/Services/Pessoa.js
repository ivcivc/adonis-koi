'use strict'

const Model = use('App/Models/Pessoa')
const Database = use('Database')

class Pessoa {
  async add (data) {
    try {
      let endereco = null

      if (data.endereco) {
        endereco = data.endereco
      }
      delete data['endereco']

      let grupos = null
      grupos = data.grupos
      delete data['grupos']

      const pessoa = await Model.create(data)

      if (endereco) {
        endereco.nr = '.'
        endereco.pessoa_id = pessoa.id
        await pessoa.endereco().create(endereco)
      }

      await pessoa.grupos().attach(grupos, null)

      return pessoa
    } catch (e) {
      throw e
    }
  }
}

module.exports = Pessoa
