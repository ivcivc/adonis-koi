/* eslint-disable no-throw-literal */
'use strict'

const Model = use('App/Models/ReceberItem')
// const Database = use('Database')

class ReceberItem {
  async add (payload, trx) {
    try {
      const registro = await Model.create(payload, trx)
      await registro.load('receber')

      return registro
    } catch (error) {
      throw {
        err: error.message,
        message: 'Não foi possível adicionar um item na conta a receber.'
      }
    }
  }

  async udpate (ID, payload) {
    try {
      const registro = await Model.findOrFail(ID)
      registro.merge(payload)
      await registro.save()
      await registro.load('receber')
      return registro
    } catch (error) {
      if (error.name === 'ModelNotFoundException') {
        throw { message: 'Item da conta a Receber não localizada!' }
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
        throw { message: 'Item da conta a receber não localizada.' }
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
      const nome = payload.nome
      const isLocalizar = payload.isLocalizar

      const query = Model.query()

      if (status) {
        query.where('status', 'LIKE', status)
        // query.orderByRaw('pessoa,nome', 'desc')
      }

      console.log('nome: ', nome)

      if (nome) {
        console.log('nome ', nome)
        query.whereHas('receber', receberQuery => {
          receberQuery.whereHas('pessoa', pessoaQuery =>
            pessoaQuery.where('nome', 'LIKE', '%' + nome + '%')
          )
        })

        let b = 1

        // query.whereHas('receber.brand', 'LIKE', nome)
        // query.orderByRaw('pessoa,nome', 'desc')
      }

      query.with('receber')
      query.with('receber.pessoa')

      if (sortSelector) {
        if (sortSelector.includes('nome')) {
          console.log(1, ' ', sortSelector)
          // query.orderByRaw('receber,brand', sortDirection)
        } else {
          console.log(2)
          query.orderBy(sortSelector, sortDirection)
        }
      } else {
        // query.orderByRaw('pessoa,nome')
      }

      const dados = await query.paginate()
      dados.rows.forEach(o => {
        let r = o.$relations.receber.$relations.pessoa
        o.aluno = r.nome
      })

      if (isLocalizar) {
      }
      return dados
    } catch (error) {
      throw { message: error.message }
    }
  }
}

module.exports = ReceberItem
