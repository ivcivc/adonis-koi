'use strict'

const Local = use('App/Models/Local')

class LocalController {
  async index ({ request, response }) {
    const status = request.input('status')
    const nome = request.input('nome')
    const sortSelector = request.input('sortSelector')
    const sortDirection = request.input('sortDirection')

    const query = Local.query()

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
      const local = await Local.create(dados)
      return local
    } catch (error) {
      return response.status(400).send('Não foi possível criar um Local.')
    }
  }

  async show ({ params, request, response }) {
    try {
      return await Local.findOrFail(params.id)
    } catch (error) {
      return response
        .status(400)
        .send('Não foi possível exibir o Local solicitado.')
    }
  }

  async update ({ params, request, response }) {
    const dados = request.all()
    try {
      let local = await Local.findOrFail(params.id)
      local.merge(dados)
      await local.save()
      return local
    } catch (e) {
      if (e.name === 'ModelNotFoundException') {
        return response.status(400).send('Local não localizado!')
      }

      if (e.name === 'TypeError') {
        return response.status(400).send(e.message)
      } else {
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            return response
              .status(400)
              .send('Duplicidade de registro detectada.')
        }
      }
      return response.status(400).send(e.message)
    }
  }

  async destroy ({ params, response }) {
    const id = params.id
    try {
      const local = await Local.find(id)
      await local.delete()
      return response.status(200).send('Excluído com sucesso!')
    } catch (error) {
      return response.status(400).send('Não foi possível excluir.')
    }
  }
}

module.exports = LocalController
