'use strict'

const ServiceContaReceber = use('App/Services/ContaReceber')

class ContaReceberController {
  async store ({ request, response }) {
    try {
      const payload = request.all()

      const res = await new ServiceContaReceber().add(payload)

      return res
    } catch (error) {
      return response.status(400).send(error)
    }
  }

  async update ({ params, request, response }) {
    try {
      const payload = request.all()
      const res = await new ServiceContaReceber().udpate(params.id, payload)
      return res
    } catch (error) {
      return response.status(400).send({ message: error.message })
    }
  }

  async destroy ({ params, response }) {
    try {
      await new ServiceContaReceber().destroy(params.id)
      return response
        .status(200)
        .send('Classificação de Conta a receber excluída com sucesso!')
    } catch (error) {
      return response.status(400).send({ message: error.message })
    }
  }

  async show ({ params, response }) {
    try {
      const res = await new ServiceContaReceber().get(params.id)
      return res
    } catch (error) {
      return response.status(400).send({ message: 'Registro não localizado.' })
    }
  }

  async index ({ request, response }) {
    try {
      let payload = {}
      const status = request.input('status')
      const sortSelector = request.input('sortSelector')
      const sortDirection = request.input('sortDirection')
      if (status) {
        payload.status = status
      }
      if (sortDirection) {
        payload.sortDirection = sortDirection
        payload.sortSelector = sortSelector === undefined ? 'ASC' : sortSelector
      }

      const query = await new ServiceContaReceber().index(payload)
      return query
    } catch (error) {
      response.status(400).send(error.message)
    }
  }
}

module.exports = ContaReceberController
