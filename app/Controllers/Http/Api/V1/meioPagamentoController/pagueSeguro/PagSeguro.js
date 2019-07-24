'use strict'

const axios = require('axios')

const convert = require('xml-js')
const Env = use('Env')

const PsUrl = Env.get('PAGSEGURO_URL')
const PsEmail = Env.get('PAGSEGURO_EMAIL')
const PsToken = Env.get('PAGSEGURO_TOKEN')

const config = {
  headers: {
    'Content-Type': 'application/json;charset=ISO-8859-1',
    Accept: 'application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1'
  }
}

class PagSeguroController {
  async session ({ response }) {
    const url = `${PsUrl}/v2/sessions/?email=${PsEmail}&token=${PsToken}`

    return axios
      .post(url)
      .then(res => {
        const json = convert.xml2json(res.data, {
          compact: true,
          spaces: 4
        })

        const oJson = JSON.parse(json)
        const session = oJson.session.id._text

        return response.status(200).send(session)
      })
      .catch(e => {
        return response.status(404).send('Não foi possível gerar sessão.')
      })
  }

  async addPlano ({ response, request }) {
    const config = {
      headers: {
        'Content-Type': 'application/json;charset=ISO-8859-1',
        Accept: 'application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1'
      }
    }

    const url = `${PsUrl}/pre-approvals/request/?email=${PsEmail}&token=${PsToken}`
    const data = request.body

    return axios
      .post(url, data, config)
      .then(res => {
        return res.data
      })
      .catch(e => {
        return response.status(404).send(e.response.data)
      })
  }

  async addAdesao ({ response, request }) {
    const url = `${PsUrl}/pre-approvals/?email=${PsEmail}&token=${PsToken}`
    const data = request.body

    return axios
      .post(url, data, config)
      .then(res => {
        return res.data
      })
      .catch(e => {
        console.log('falha')
        return response.status(404).send(e.response.data)
      })
  }

  async consultarPlanos ({ response, request }) {
    const url = `${PsUrl}/pre-approvals/request?email=${PsEmail}&token=${PsToken}`
    const params = request.all()

    const headers = {
      Accept: 'application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1'
    }

    return axios
      .get(url, {
        params,
        headers
      })
      .then(res => {
        return res.data
      })
      .catch(e => {
        return response.status(404).send(e.response.data)
      })
  }

  async listarOrdemsPagamento ({ response, request }) {
    const params = request.only(['code'])
    const url = `${PsUrl}/pre-approvals/${
      params.code
    }/payment-orders?email=${PsEmail}&token=${PsToken}`
    const headers = {
      Accept: 'application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1'
    }

    return axios
      .get(url, { headers })
      .then(res => {
        return res.data
      })
      .catch(e => {
        return response.status(404).send(e.response.data)
      })
  }

  notificacao ({ response, request }) {
    console.log('notificacao.... ')
    console.log(request.only())
    console.log(request.only(['notificationCode']))
    response.status(200).send('ok')
  }
}

module.exports = PagSeguroController
