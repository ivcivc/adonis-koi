'use strict'

const Evento = use('App/Models/Evento')

const EventoLocalizarTransformer = use(
  'App/Transformers/Evento/EventoLocalizarTransformer'
)

/**
 * Resourceful controller for interacting with eventos
 */
class EventoController {
  async index ({ request, transform }) {
    const status = request.input('status')
    const nome = request.input('nome')
    const isLocalizar = request.input('isLocalizar')
    const sortSelector = request.input('sortSelector')
    const sortDirection = request.input('sortDirection')
    const page =
      request.input('page') === 'undefined' ? null : request.input('page')
    const limit =
      request.input('limit') === 'undefined' ? null : request.input('limit')

    const query = Evento.query()

    if (status) {
      query.where('status', 'LIKE', status)
      // query.orderByRaw('participantes, nome')
    }

    if (nome) {
      query.where('nome', 'LIKE', nome)
      // query.orderByRaw('participantes, nome')
    }

    query.with('local')
    query.with('treinamento')
    query.with('participantes')

    if (sortSelector) {
      query.orderBy(sortSelector, sortDirection)
    } else {
      query.orderBy('nome', 'ASC')
    }

    let dados = null

    if (page && limit) {
      dados = await query.paginate(page, limit)
    } else {
      dados = await query.paginate()
    }

    if (isLocalizar) {
      console.log(' localizar ... ')
      return transform.paginate(dados, EventoLocalizarTransformer)
    } else {
      console.log(' NÃO localizar ... ')
      return dados
    }
  }

  async store ({ request, response }) {
    const {
      nome,
      treinamento_id,
      local_id,
      dInicio,
      dTermino,
      valorBase,
      siteExibir,
      siteParcelas,
      siteEvento,
      siteDetalhes,
      obs,
      status
    } = request.all()

    try {
      const evento = await Evento.create({
        nome,
        treinamento_id,
        local_id,
        dInicio,
        dTermino,
        valorBase,
        siteExibir,
        siteParcelas,
        siteEvento,
        siteDetalhes,
        obs,
        status
      })
      return evento
    } catch (error) {
      console.log(error)
      return response.status(400).send('Não foi possível criar um Evento.')
    }
  }

  async show ({ params, response, transform }) {
    try {
      /* const query = Evento.query()

      query.where('id', 'LIKE', params.id)

      query.with('local')
      query.with('treinamento')
      query.with('participantes')

      const dados = await query.fetch() */
      const evento = await Evento.findOrFail(params.id)
      await evento.load('local')
      await evento.load('treinamento')
      /* let xxx = await evento.local().fetch()
      let r = xxx.nome
      await evento.load('participantes')

      let ddd = await evento.participantes().fetch()

      ddd.rows.forEach(e => {
        console.log(e.id)
      }) */

      // evento.participantes.forEach(r => console.log(r))
      // let a = await evento.participantes().fetch()
      // console.log(a[0].id)
      // return a
      // evento.with('local')
      return evento // transform.item(evento, EventoLocalizarTransformer)
    } catch (error) {
      return response
        .status(400)
        .send('Não foi possível exibir o Evento solicitado.')
    }
  }

  async update ({ params, request, response }) {
    const data = request.all()
    try {
      let evento = await Evento.findOrFail(params.id)
      evento.merge(data)
      await evento.save()
      return evento
    } catch (e) {
      if (e.name === 'ModelNotFoundException') {
        return response.status(400).send({ message: 'Evento não localizado!' })
      }

      if (e.name === 'TypeError') {
        return response.status(400).send({ message: e.message })
      } else {
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            return response
              .status(400)
              .send({ message: 'Duplicidade de registro detectada.' })
        }
      }
      return response.status(400).send(e.message)
    }
  }

  async destroy ({ params, request, response }) {
    const id = params.id
    try {
      const evento = await Evento.find(id)
      await evento.delete()
      return response.status(200).send('Excluído com sucesso!')
    } catch (error) {
      return response.status(400).send('Não foi possível excluir.')
    }
  }

  async TESTE ({ params, request, response }) {}
}

module.exports = EventoController
