'use strict'

const TipoNegociacao = use('App/Models/TipoNegociacao')
class TipoNegociacaoController {
  async index ({ request }) {
    const status = request.input('status')
    const nome = request.input('nome')
    const sortSelector = request.input('sortSelector')
    const sortDirection = request.input('sortDirection')

    const query = TipoNegociacao.query()

    if (nome) {
      query.where('nome', 'LIKE', '%' + nome + '%')
    }

    if (status) {
      query.where('status', 'LIKE', status)
    }
    if (sortSelector) {
      query.orderBy(sortSelector, sortDirection)
    } else {
      query.orderBy('nome', 'ASC')
    }

    const dados = await query.paginate()
    return dados
  }

  async store ({ request, response }) {
    const dados = request.all()

    try {
      const tipoNegociacao = await TipoNegociacao.create(dados)
      return tipoNegociacao
    } catch (error) {
      console.log(error)
      return response
        .status(400)
        .send('Não foi possível criar um Tipo de Negociacao.')
    }
  }

  async show ({ params, response }) {
    try {
      return await TipoNegociacao.findOrFail(params.id)
    } catch (error) {
      return response
        .status(400)
        .send('Não foi possível exibir o Tipo de Negociacao solicitado.')
    }
  }

  async update ({ params, request, response }) {
    const dados = request.all()
    try {
      let tipoNegociacao = await TipoNegociacao.findOrFail(params.id)
      tipoNegociacao.merge(dados)
      await tipoNegociacao.save()
      return tipoNegociacao
    } catch (e) {
      if (e.name === 'ModelNotFoundException') {
        return response
          .status(400)
          .send({ message: 'Tipo de Negociacao não localizado!' })
      }

      if (e.name === 'TypeError') {
        return response.status(400).send({ message: e.message })
      } else {
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            return response
              .status(400)
              .send({ message: 'Duplicidade de registro detectada.' })
        }
      }
      return response.status(400).send(e.message)
    }
  }

  async destroy ({ params, response }) {
    const id = params.id
    try {
      const tipoNegociacao = await TipoNegociacao.find(id)
      await tipoNegociacao.delete()
      return response.status(200).send('Excluído com sucesso!')
    } catch (error) {
      return response.status(400).send('Não foi possível excluir.')
    }
  }
}

module.exports = TipoNegociacaoController
