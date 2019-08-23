/* eslint-disable no-throw-literal */
'use strict'

const Model = use('App/Models/ReceberItem')
const ServiceReceber = use('App/Services/Receber')
// const Database = use('Database')

const _quitado = [
  'payExternal',
  'captured',
  'payedBoleto',
  'lessValueBoleto',
  'moreValueBoleto',
  'paidDuplicityBoleto',
  'liquidado'
]
const _cancelado = ['cancel', 'cancelado']
const _pendente = [
  'denied',
  'processError',
  'reversed',
  'notSend',
  'pendingBoleto',
  'free',
  'authorized',
  'emAberto',
  'transmitir',
  'auto'
]

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

      /* Atualizar status da conta a receber */
      const receber = await new ServiceReceber().udpate(registro.receber_id, {
        id: registro.receber_id
      })

      return { item: registro, receber }
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
      const page = payload.page
      const limit = payload.limit
      const isPeriodo = payload.isPeriodo
      const dInicio = payload.dInicio
      const dTermino = payload.dTermino

      const query = Model.query()

      if (status) {
        if (status === 'EM ABERTO') {
          query.whereIn('status', _pendente)
          query.whereHas('receber', receberQuery => {
            receberQuery.where('status', 'active')
          })
        }

        if (status === 'FINALIZADO') {
          query.whereIn('status', _quitado)
        }

        if (status === 'CANCELADO') {
          query.whereIn('status', _cancelado)
        }
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

      if (isPeriodo) {
        query.whereBetween('payDay', [dInicio, dTermino])
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

      const dados = await query.paginate(page, limit)
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
