'use strict'

const ServiceReceberItems = use('App/Services/ReceberItems')

class ReceberItemController {
  async store ({ request, response }) {
    try {
      const payload = request.all()

      const res = await new ServiceReceberItems().add(payload)

      return res
    } catch (error) {
      return response.status(400).send(error)
    }
  }

  async update ({ params, request, response }) {
    try {
      const payload = request.all()
      const res = await new ServiceReceberItems().udpate(params.id, payload)
      return res
    } catch (error) {
      return response.status(400).send({ message: error.message })
    }
  }

  async destroy ({ params, response }) {
    try {
      await new ServiceReceberItems().destroy(params.id)
      return response
        .status(200)
        .send('O item da conta a receber foi excluído com sucesso!')
    } catch (error) {
      return response.status(400).send({ message: error.message })
    }
  }

  async show ({ params, response }) {
    try {
      const res = await new ServiceReceberItems().get(params.id)
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
      const nome = request.input('nome')
      const isLocalizar = !!request.input('isLocalizar')

      payload.isLocalizar = isLocalizar
      console.log('l o c a l i z a n d o')

      if (nome) {
        payload.nome = nome
      }
      if (status) {
        payload.status = status
      }
      if (sortDirection) {
        payload.sortDirection = sortDirection
        payload.sortSelector = sortSelector === undefined ? 'ASC' : sortSelector
      }

      const query = await new ServiceReceberItems().index(payload)
      return query
    } catch (error) {
      response.status(400).send(error.message)
    }
  }
}

module.exports = ReceberItemController
