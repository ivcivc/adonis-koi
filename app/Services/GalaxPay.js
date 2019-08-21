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
    return new Promise((resolve, reject) => {
      const url = `${_URL}/createPaymentBillAndCustomer`
      const data = {
        Auth,
        Request: payload
      }

      axios
        .post(url, data)
        .then(res => {
          console.log('galaxy resolvido')
          resolve(res.data)
        })
        .catch(e => {
          console.log('galax falhou')
          reject(e.data)
        })
    })
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

  async pagarForaSistema (ID) {
    return new Promise((resolve, reject) => {
      const url = `${_URL}/payedExternalTransaction`
      const data = {
        Auth,
        Request: { transactionIntegrationId: `${ID}` }
      }

      axios
        .post(url, data)
        .then(res => {
          resolve(res)
        })
        .catch(e => {
          console.log('galax falhou')
          reject(e)
        })
    })
  }
}

module.exports = GalaxPay
