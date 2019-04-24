'use strict'

const pagarme = require('pagarme')

class PagarMeController {
  async addPlano ({ response, request }) {
    await pagarme.client
      .connect({ api_key: 'ak_test_3wqinEYnwWxD9gGhUjZvWmvnWpz9Ds' })
      .then(client =>
        client.plans
          .create({
            amount: 31000,
            days: 365,
            installments: 4,
            charges: 2, // 2=cartao de crédito
            name: 'Plano 2 - 4x crédito',
            payments_methods: ['credit_card']
          })
          .then(client => {
            console.log('deu certo', client)
            return response.status(400).send(client)
          })
          .catch(e => {
            console.log('errou total.... ', e.response.errors)
            return response.status(400).send(e.response.errors)
          })
      )
      .catch(e => {
        return response
          .status(400)
          .send('Ocorreu um falha de conexão com o Pagar.me')
      })
  }
}

module.exports = PagarMeController
