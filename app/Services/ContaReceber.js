/* eslint-disable no-throw-literal */
'use strict'

const Model = use('App/Models/ContaReceber')
// const Database = use('Database')

class ContaReceber {
  async add (payload) {
    try {
      const registro = await Model.create(payload)

      return registro
    } catch (error) {
      throw { message: 'Não foi possível adicionar o registro selecionado.' }
    }
  }

  async udpate (ID, payload) {
    try {
      const registro = await Model.findOrFail(ID)
      registro.merge(payload)
      await registro.save()
      return registro
    } catch (error) {
      if (error.name === 'ModelNotFoundException') {
        throw { message: 'Classificação de Conta a Receber não localizada!' }
      }

      if (error.name === 'TypeError') {
        throw { message: error.message }
      } else {
        switch (error.code) {
          case 'ER_DUP_ENTRY':
            throw { message: 'Duplicidade de registro detectada.' }
        }
      }
      throw { message: error.message }
    }
  }

  async destroy (ID) {
    try {
      const registro = await Model.findOrFail(ID)
      await registro.delete()
      return registro
    } catch (error) {
      if (error.code === 'E_MISSING_DATABASE_ROW') {
        throw { message: 'Classificação da Conta a receber não localizada.' }
      }
      throw { message: 'Não é possível excluir o registro selecionado.' }
    }
  }

  async get (ID) {
    const registro = await Model.findOrFail(ID)
    return registro
  }

  async index (payload) {
    try {
      const sortSelector = payload.sortSelector
      const sortDirection = payload.sortDirection
      const status = payload.status

      const query = Model.query()

      if (status) {
        query.where('status', 'LIKE', status)
        // query.orderByRaw('pessoa,nome', 'desc')
      }

      if (sortSelector) {
        query.orderBy(sortSelector, sortDirection)
      } else {
        // query.orderByRaw('pessoa,nome')
      }

      const dados = await query.fetch()
      return dados
    } catch (error) {
      throw { message: error.message }
    }
  }
}

module.exports = ContaReceber
