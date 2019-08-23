'use strict'

const Prospeccao = use('App/Models/Prospeccao')
const moment = require('moment-timezone')

class ProspeccaoController {
  async index ({ request, response, params }) {
    try {
      const { StartDate, EndDate } = request.all()
      // let x = moment.tz(StartDate, 'America/Sao_Paulo')
      // console.log(x)

      const query = await Prospeccao.query()
        .where('StartDate', '<', moment(StartDate).format())
        .andWhere('EndDate', '>', moment(EndDate).format())
        .fetch()
      response.status(200).send({ data: query })
    } catch (e) {
      response.status(400).send({ message: e.message })
    }
  }

  async store ({ request, response }) {
    const data = request.all()
    const prospeccao = await Prospeccao.create(data)
    response.status(200).send({ data: prospeccao })
  }

  async update ({ request }) {
    const payload = request.all()
    console.log('update executado.... ')
    const prospeccao = await Prospeccao.findOrFail(payload.id)
    const inicio = moment.tz(payload.StartDate, 'America/Sao_Paulo')
    const inicioUtc = moment(inicio).utc(inicio)
    const inicioTz = moment.tz(inicioUtc.format(), 'America/Sao_Paulo')
    const fim = moment.tz(payload.EndDate, 'America/Sao_Paulo')
    const fimUtc = moment(fim).utc(fim)
    const fimTz = moment.tz(fimUtc.format(), 'America/Sao_Paulo')

    payload.StartDate = inicioTz.utc().format()
    payload.EndDate = fimTz.utc().format()

    prospeccao.merge(payload)
    prospeccao.save()
    return prospeccao
  }

  async destroy ({ request, params, response }) {
    const { key } = request.all()
    const id = params.id
    try {
      const prospeccao = await Prospeccao.findOrFail(id)
      await prospeccao.delete()
      return response.status(200).send('Excluído com sucesso!')
    } catch (error) {
      return response.status(400).send('Não foi possível excluir.')
    }
  }
}

module.exports = ProspeccaoController
