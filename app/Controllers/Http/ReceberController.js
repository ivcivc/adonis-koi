'use strict'

// const Receber = use('App/Models/Receber')
const Database = use('Database')

const ServiceReceber = use('App/Services/Receber')
const ServicePessoa = use('App/Services/Pessoa')

class ReceberController {
  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try {
      const { payload, card } = request.all()
      const items = payload.receberItems
      delete payload.receberItems
      let isNewcard = payload.cardInternalId === '_new'
      let cardEnviar = null

      if (isNewcard) {
        if (!card) {
          // eslint-disable-next-line no-throw-literal
          throw 'Cartão de crédito não informado.'
        }
        cardEnviar = {
          integrationId: 'CARD-6+',
          number: '4716 0248 9944 1650',
          holder: 'Cliente de exemplo Galax Pay',
          expiryMonth: '04',
          expiryYear: '2023',
          cvv: '541',
          brand: 'visa'
        }
      } else {
        cardEnviar = {
          integrationId: payload.cardInternalId
        }
      }

      let integrationIds = {}

      const receber = await new ServiceReceber().add(payload, trx)

      for (let index in items) {
        const receberItems = await receber
          .receberItems()
          .create(items[index], trx)

        integrationIds[`${parseInt(index) + 1}`] = {
          integrationId: `${receberItems.id}`
        }
      }

      if (receber.meioPgto === 'koi') {
        console.log('koi')
      }

      if (receber.meioPgto === 'galaxpay') {
        console.log('galaxpay.')

        // const receberItems = await receber.receberItems().create(items[0], trx)
      }

      const receberItems = await receber.receberItems().createMany(items, trx)
      // const ri = receberItems.fetch()
      receberItems.forEach(e => console.log(e.id))

      await trx.rollback()
      // return res
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
