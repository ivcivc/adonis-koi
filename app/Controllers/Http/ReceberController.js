'use strict'

// const Receber = use('App/Models/Receber')

const ServiceReceber = use('App/Services/Receber')

class ReceberController {
  async store ({ request, response }) {
    try {
      const payload = request.all()

      const res = await new ServiceReceber().add(payload)

      return res
    } catch (error) {
      return response.status(400).send(error)
    }
  }

  async update ({ params, request, response }) {
    try {
      const payload = request.all()
      const res = await new ServiceReceber().udpate(params.id, payload)
      return res
    } catch (error) {
      return response.status(400).send({ message: error.message })
    }
  }

  async destroy ({ params, response }) {
    try {
      await new ServiceReceber().destroy(params.id)
      return response.status(200).send('Conta a receber excluída com sucesso!')
    } catch (error) {
      return response.status(400).send({ message: error.message })
    }
  }

  async show ({ params, response }) {
    console.log('show')
    try {
      const res = await new ServiceReceber().get(params.id) //.with('receberItems')
      await res.load('receberItems')
      return res
    } catch (error) {
      return response.status(400).send({ message: 'Registro não localizado.' })
    }
  }

  async index ({ request, response }) {
    console.log('index')
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

      const query = await new ServiceReceber().index(payload)
      return query
    } catch (error) {
      response.status(400).send(error.message)
    }
  }
}

module.exports = ReceberController
