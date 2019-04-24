'use strict'

// import pagseguro from 'pagseguro'
let pagseguro = require('pagseguro')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with locals
 */
class LocalController {
  /**
   * Show a list of all locals.
   * GET locals
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    console.log('rodando modulo pagto seguro')

    try {
      // eslint-disable-next-line new-cap
      let pag = new pagseguro({
        email: 'ivan.a.oliveira@terra.com.br',
        token: '3ADCFD46A6BE4D9C84FE56DD1D773FAB',
        mode: 'subscription' // 'sandbox'
      })
      console.log('rodando modulo pagto seguro 2')
      // Configurando a moeda e a referência do pedido
      pag.currency('BRL')
      pag.reference('12345')

      // Configurando as informações do comprador
      pag.buyer({
        name: 'José Comprador',
        email: 'c82212378446093264778@sandbox.pagseguro.com.br',
        phoneAreaCode: '51',
        phoneNumber: '12345678',
        street: 'Rua Alameda dos Anjos',
        number: '367',
        complement: 'Apto 307',
        district: 'Parque da Lagoa',
        postalCode: '01452002',
        city: 'São Paulo',
        state: 'RS',
        country: 'BRA'
      })

      console.log('rodando modulo pagto seguro 3')

      // Configurando os detalhes da assinatura (ver documentação do PagSeguro para mais parâmetros)
      pag.preApproval({
        // charge: 'auto' para cobranças automáticas ou 'manual' para cobranças
        // disparadas pelo seu back-end
        // Ver documentação do PagSeguro sobre os tipos de cobrança
        charge: 'manual',
        // Título da assinatura (até 100 caracteres)
        name: 'Assinatura de serviços',
        // Descrição da assinatura (até 255 caracteres)
        details: 'Assinatura mensal para prestação de serviço da loja modelo',
        // Valor de cada pagamento
        amountPerPayment: '50.00',
        // Peridiocidade dos pagamentos: Valores: 'weekly','monthly','bimonthly',
        // 'trimonthly','semiannually','yearly'
        period: 'monthly',
        // Data de expiração da assinatura (máximo 2 anos após a data inicial)
        finalDate: '2019-10-09T00:00:00.000-03:00'
      })

      console.log('rodando modulo pagto seguro 4')

      // Enviando o xml ao pagseguro
      pag.send(function (err, res) {
        if (err) {
          console.log(err)
          return err
        }
        console.log('send retornou: ', res)
        return res
      })
    } catch (e) {
      return e
    }

    return true
  }

  /**
   * Render a form to be used for creating a new local.
   * GET locals/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {}

  /**
   * Create/save a new local.
   * POST locals
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {}

  /**
   * Display a single local.
   * GET locals/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {}

  /**
   * Render a form to update an existing local.
   * GET locals/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {}

  /**
   * Update local details.
   * PUT or PATCH locals/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {}

  /**
   * Delete a local with id.
   * DELETE locals/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {}
}

module.exports = LocalController
