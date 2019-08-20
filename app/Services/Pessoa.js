'use strict'

const Model = use('App/Models/Pessoa')
// const Database = use('Database')

class Pessoa {
  async update (data, trx) {
    try {
      let endereco = null

      if (data.endereco) {
        endereco = data.endereco
      }
      delete data['endereco']

      let grupos = null
      grupos = data.grupos
      delete data['grupos']

      let pessoa = await Model.findOrFail(data.id)

      pessoa.merge(data)

      let end = await pessoa.endereco().fetch()

      if (end) {
        await end.delete()
      }

      if (endereco) {
        await pessoa.endereco().create(endereco, null, trx)
      }

      await pessoa.grupos().sync(grupos, null, trx)

      await pessoa.save(trx)

      return pessoa
    } catch (e) {
      throw e
    }
  }

  async add (data, trx) {
    try {
      let endereco = null

      if (data.endereco) {
        endereco = data.endereco
      }
      delete data['endereco']

      let grupos = null
      grupos = data.grupos
      delete data['grupos']

      const pessoa = await Model.create(data, trx)

      if (endereco) {
        endereco.nr = '.'
        endereco.pessoa_id = pessoa.id
        await pessoa.endereco().create(endereco, trx)
      }

      await pessoa.grupos().attach(grupos, null, trx)

      return pessoa
    } catch (e) {
      throw e
    }
  }

  async get (ID) {
    try {
      const pessoa = await Model.find(ID)

      return pessoa
    } catch (e) {
      throw e
    }
  }

  async getCPF (cpf) {
    try {
      const query = Model.query()
      query.where('cpf', '=', cpf)
      query.with('endereco')
      const pessoa = await query.fetch()

      return pessoa
    } catch (e) {
      throw e
    }
  }
}

module.exports = Pessoa
