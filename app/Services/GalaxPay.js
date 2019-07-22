'use strict'

const axios = require('axios')

const ServicePessoa = use('App/Services/Pessoa')

const Env = use('Env')

const _URL = Env.get('GALAXPAY_URL')
const _ID = Env.get('GALAXPAY_ID')
const _HASH = Env.get('GALAXPAY_HASH')

const Auth = {
  galaxId: _ID,
  galaxHash: _HASH
}

/***
 * Área destinada ao cadastro ou alteração de um
 * cliente e cadastro de um Contrato/Venda para realizar
 * a cobrança em um cartão de crédito ou débito.
 * Este novo Contrato/Venda poderá ser configurado de diferentes formas.
 */
class GalaxPay {
  async createPaymentBillAndCustomer (payload) {
    const url = `${_URL}/createPaymentBillAndCustomer`
    const data = {
      Auth,
      Request: payload
    }

    const retorno = await axios
      .post(url, data)
      .then(res => {
        return res.data
      })
      .catch(e => {
        return e.data
      })
    return retorno
  }

  async getPessoaCartoes (ID) {
    const url = `${_URL}/getCardsByCustomer`
    const data = {
      method: 'get',
      responseType: 'json',
      url,
      data: {
        Auth,
        Request: {
          customerIntegrationId: `${ID}`
        }
      }
    }
    const retorno = await axios(data)
      .then(res => {
        return res.data
      })
      .catch(e => {
        return e.data
      })
    return retorno
  }

  async getBandeiras () {
    const url = `${_URL}/getAllBrandsEnabled`
    const data = {
      method: 'get',
      responseType: 'json',
      url,
      data: {
        Auth
      }
    }
    const retorno = await axios(data)
      .then(res => {
        return res.data
      })
      .catch(e => {
        return e.data
      })
    return retorno
  }

  async getCPF (cpf) {
    const res = await new ServicePessoa().getCPF(cpf)
    return res
  }

  async getCpfGalaxPay (cpf) {
    const url = `${_URL}/getCustomerInfo`
    const data = {
      method: 'get',
      responseType: 'json',
      url,
      data: {
        Auth,
        Request: { customerDocument: cpf }
      }
    }
    const retorno = await axios(data)
      .then(res => {
        return res.data
      })
      .catch(e => {
        return e.data
      })
    return retorno
  }
}

module.exports = GalaxPay
