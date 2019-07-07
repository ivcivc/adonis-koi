'use strict'

const axios = require('axios')
const Service = require('../../../../Services/GalaxPay')

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
    const ID = params.ID
    const cartoes = await new Service().getPessoaCartoes(ID)
    return cartoes
  }

  async getBandeiras () {
    const bandeiras = await new Service().getBandeiras()
    return bandeiras
  }
}

module.exports = GalaxPayController
