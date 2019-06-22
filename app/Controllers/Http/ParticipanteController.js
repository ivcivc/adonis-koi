'use strict'

const Participante = use('App/Models/Participante')
/* const ParticipanteTransformer = use(
  'App/Transformers/Evento/ParticipanteTransformer'
) */

class ParticipanteController {
  async index ({ request, response }) {
    // eslint-disable-next-line camelcase
    const evento_id = request.input('evento_id')

    const query = Participante.query() // .with('local')

    // eslint-disable-next-line camelcase
    if (!evento_id) {
      return response
        .status(400)
        .send('Não foi possível localizar o participante solicitado.')
    }

    // eslint-disable-next-line camelcase
    if (evento_id) {
      query.where('evento_id', 'LIKE', evento_id)
    }

    query.with('pessoa')
    query.with('evento')
    query.with('consultor')

    const reg = await query.fetch()
    reg.rows.forEach(r => {
      const i = r
      console.log(i)
    })
    // eslint-disable-next-line no-return-await
    return reg

    // const dados = await query.paginate()

    // return dados
    // return transform.paginate(dados, ParticipanteTransformer)
  }

  async store ({ request, response }) {
    const dados = request.all()

    try {
      const evento = await Participante.create(dados)
      return evento
    } catch (error) {
      console.log(error)
      return response
        .status(400)
        .send('Não foi possível Adicionar um participante a um Evento.')
    }
  }

  async show ({ params, response }) {
    try {
      const participante = Participante.query()
      participante.where('id', '=', params.id)
      participante.with('pessoa')
      participante.with('evento')
      participante.with('consultor')
      const o = await participante.fetch()
      if (o.rows.length === 0) {
        return response.status(400).send('Participante não localizado.')
      }
      return o
      // return transform.collection(o, ParticipanteTransformer)
    } catch (error) {
      console.log(error)
      return response
        .status(400)
        .send('Não foi possível exibir um participante do Evento solicitado.')
    }
  }

  async update ({ params, request, response }) {
    const data = request.all()
    try {
      let participante = await Participante.findOrFail(params.id)
      participante.merge(data)
      await participante.save()
      return participante
    } catch (e) {
      if (e.name === 'ModelNotFoundException') {
        return response
          .status(400)
          .send({ message: 'Participante não localizado!' })
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

  async destroy ({ params, response }) {
    const id = params.id
    try {
      const participante = await Participante.find(id)
      await participante.delete()
      return response.status(200).send('Excluído com sucesso!')
    } catch (error) {
      return response.status(400).send('Não foi possível excluir.')
    }
  }
}

module.exports = ParticipanteController
