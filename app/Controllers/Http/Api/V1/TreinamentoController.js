'use strict'

const Treinamento = use('App/Models/Treinamento')

/**
 * Resourceful controller for interacting with treinamentos
 */
class TreinamentoController {
  async index ({ request, response }) {
    const status = request.input('status')

    const query = Treinamento.query()

    if (status) {
      query.where('status', 'LIKE', status)
    }

    const dados = await query.paginate()
    return dados
  }

  async store ({ request, response }) {
    const { nome, valor, status } = request.all()

    try {
      const treinamento = await Treinamento.create({ nome, valor, status })
      return treinamento
    } catch (error) {
      return response.status(400).send('Não foi possível criar um Treinamento.')
    }
  }

  async show ({ params, request, response }) {
    try {
      return await Treinamento.findOrFail(params.id)
    } catch (error) {
      return response
        .status(400)
        .send('Não foi possível exibir o Treinamento solicitado.')
    }
  }

  async update ({ params, request, response }) {
    const { nome, valor, status } = request.all()
    try {
      let treinamento = await Treinamento.findOrFail(params.id)
      treinamento.merge({ nome, valor, status })
      await treinamento.save()
      return treinamento
    } catch (e) {
      if (e.name === 'ModelNotFoundException') {
        return response.status(400).send('Treinamento não localizado!')
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

  async destroy ({ params, request, response }) {
    const id = params.id
    try {
      const treinamento = await Treinamento.find(id)
      await treinamento.delete()
      return response.status(200).send('Excluído com sucesso!')
    } catch (error) {
      return response.status(400).send('Não foi possível excluir.')
    }
  }
}

module.exports = TreinamentoController