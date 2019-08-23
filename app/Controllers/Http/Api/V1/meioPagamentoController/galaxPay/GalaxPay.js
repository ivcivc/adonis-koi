'use strict'

const axios = require('axios')
const Service = require('../../../../../../Services/GalaxPay')

// const ServicePessoa = use('../../../../Services/Pessoa')

const Env = use('Env')

const _URL = Env.get('GALAXPAY_URL')
const _ID = Env.get('GALAXPAY_ID')
const _HASH = Env.get('GALAXPAY_HASH')

const Auth = {
  galaxId: _ID,
  galaxHash: _HASH
}

class GalaxPayController {
  async getCliente ({ response, request }) {
    const url = `${_URL}/getCustomerInfo`
    const params = request.all()

    params.Auth = Auth

    return axios
      .post(url, params)
      .then(res => {
        return res.data
      })
      .catch(e => {
        return response.status(404).send(e.response.data)
      })
  }

  async getPessoaCartoes ({ params, response }) {
    const ID = params.id
    const cartoes = await new Service().getPessoaCartoes(`##${ID}`)

    return cartoes
  }

  async getBandeiras () {
    const bandeiras = await new Service().getBandeiras()
    return bandeiras
  }

  async getCPF ({ request }) {
    const { cpf } = request.all()
    const retorno = await new Service().getCPF(cpf)

    return retorno
  }

  async pagarForaSistema ({ request }) {
    // eslint-disable-next-line camelcase
    const { receber_item_id } = request.only('receber_item_id')

    const retorno = await new Service().pagarForaSistema(receber_item_id)

    return retorno.data
  }

  async retryTransaction ({ request }) {
    // eslint-disable-next-line camelcase
    const { cliente_id, receber_id, receber_item_id } = request.all()

    const retorno = await new Service().retryTransaction(
      cliente_id,
      receber_id,
      receber_item_id
    )

    return retorno.data
  }
}

module.exports = GalaxPayController
