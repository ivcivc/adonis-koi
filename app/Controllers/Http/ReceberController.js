'use strict'

// const Receber = use('App/Models/Receber')
const Database = use('Database')

const ServiceReceber = use('App/Services/Receber')
const ServicePessoa = use('App/Services/Pessoa')

class ReceberController {
  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try {
      const payload = request.all()
      const items = payload.receberItems
      delete payload.receberItems

      const receber = await new ServiceReceber().add(payload, trx)
      if (receber.meioPgto === 'koi') {
        console.log('koi')
        items.forEach((e, index) => {
          // const receberItems = await receber.receberItems().create(items[index], trx)
        })
      }

      if (receber.meioPgto === 'galaxpay') {
        console.log('galaxpay.')
        // const receberItems = await receber.receberItems().create(items[0], trx)
      }

      const receberItems = await receber.receberItems().attach(items, null, trx)

      await trx.rollback()
      return res
    } catch (error) {
      await trx.rollback()
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
      const res = await new ServiceReceber().get(params.id) // .with('receberItems')
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
