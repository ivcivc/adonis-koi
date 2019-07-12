/* eslint-disable camelcase */
/* eslint-disable no-throw-literal */
'use strict'

const Model = use('App/Models/Receber')

class Receber {
  async add (payload, trx) {
    try {
      console.log(payload)
      const { meioPgto, pessoa_id } = payload
      console.log(1)
      if (!meioPgto) {
        throw { message: 'Meio de pagamento não informado.' }
      }
      console.log(2)
      if (!pessoa_id) {
        throw { message: 'Aluno não informado.' }
      }
      console.log(3)
      const receber = await Model.create(payload, trx)
      const pessoa = await receber.load('pessoa')
      // await receber.load('evento')
      // await receber.load('participacao')
      // await receber.load('receberItems')

      return receber
    } catch (error) {
      console.log(error.message)
      throw { message: 'Não foi possível adicionar uma canta a receber.' }
    }
  }

  async udpate (ID, payload) {
    try {
      const receber = await Model.findOrFail(ID)
      receber.merge(payload)
      await receber.save()
      return receber
    } catch (error) {
      if (error.name === 'ModelNotFoundException') {
        throw { message: 'Conta a Receber não localizada!' }
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
      const receber = await Model.findOrFail(ID)
      await receber.delete()
      return receber
    } catch (error) {
      if (error.code === 'E_MISSING_DATABASE_ROW') {
        throw { message: 'Conta a receber não localizada.' }
      }
      throw { message: 'Não é possível excluir o registro selecionado.' }
    }
  }

  async get (ID) {
    const receber = await Model.findOrFail(ID)

    return receber
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

      query.with('receberItems')
      query.with('pessoa')
      query.with('contaReceber')

      if (sortSelector) {
        query.orderBy(sortSelector, sortDirection)
      } else {
        // query.orderByRaw('pessoa,nome')
      }

      const dados = await query.paginate()
      return dados
    } catch (error) {
      throw { message: error.message }
    }
  }
}

module.exports = Receber

/*

      const findPessoa = await new ServicePessoa().get(pessoa_id)
      if (findPessoa) {
      } else {
        throw 'Aluno não encontrado'
      }
        const grupoAluno = await new ServiceGrupo().getIdGrupoAluno()
        gruposPessoa = await findPessoa.grupos().fetch()
        if (!gruposPessoa.rows.includes(grupoAluno)) {
          await findPessoa.grupos().attach([grupoAluno], null, trx)
        } */
