/* eslint-disable no-throw-literal */
'use strict'

const Database = use('Database')
const Mail = use('Mail')
const Env = use('Env')
const _MAIL_EMPRESA = Env.get('MAIL_EMPRESA')

class MaladiretaController {
  async localizar ({ request, response }) {
    try {
      const payload = request.all()

      const query = Database.table('participantes')

        .select(
          'pessoa_id',
          'pessoas.nome as pessoa',
          'pessoas.cpf',
          'pessoas.email',
          'pessoas.sexo',
          'pessoas.dnasc',
          'pessoas.estado_civil'
        )
        // .innerJoin('participantes', 'eventos.id', 'participantes.evento_id')
        // .innerJoin('treinamentos', 'eventos.treinamento_id', 'treinamentos.id')
        .innerJoin('pessoas', 'participantes.pessoa_id', 'pessoas.id')

      if (payload.estado_civil) {
        query.whereIn('pessoas.estado_civil', payload.estado_civil)
      }
      if (payload.treinamento_id) {
        query
          .count('* as count')
          .whereIn('evento_id', payload.treinamento_id)
          .groupBy('pessoa_id')
          .having('count', '>=', payload.treinamento_id.length)
      }

      if (payload.sexo) {
        query.where('pessoas.sexo', payload.sexo)
      }

      if (payload.not_treinamento_id) {
        // query.whereNotIn('eventos.treinamento_id', payload.not_treinamento_id)
        query
          .whereNotIn('pessoa_id', function () {
            this.from('participantes')
              .select('pessoa_id')
              .whereIn('evento_id', payload.not_treinamento_id)
              .groupBy('pessoa_id')
              .havingRaw(
                'count(pessoa_id) >= ?',
                payload.not_treinamento_id.length
              )
          })
          .groupBy('pessoa_id')
      }
      // query.where(1)
      if (!payload.not_treinamento_id && !payload.treinamento_id) {
        query.groupBy('pessoa_id')
      }

      const r = await query.orderBy('pessoas.nome') // .groupBy('pessoas.nome')

      response.status(200).send({ data: r })

      return
    } catch (error) {
      return response.status(400).send(error)
    }
  }

  async dispararTesteEmail ({ request, response }) {
    const { titulo, emailHtml } = request.all()

    await Mail.send(
      ['emails.mala_direta'],
      {
        mala_direta: emailHtml
      },
      message => {
        message
          .to(_MAIL_EMPRESA)
          .from(_MAIL_EMPRESA)
          .subject(titulo)
      }
    )
    response.status(200).send({ message: 'Email enviado com sucesso!' })
  }

  async dispararEmail ({ request, response }) {
    const { pessoas, titulo, emailHtml } = request.all()

    let lSend = true
    let lFim = false

    try {
      pessoas.forEach(e => {
        e.ok = false
      })

      for (let a = 0; a < pessoas.length; a++) {
        await Mail.send(
          ['emails.mala_direta'],
          {
            mala_direta: emailHtml
          },
          message => {
            message
              .to(_MAIL_EMPRESA)
              .from(pessoas[a].email)
              .subject(titulo)
          }
        )
        if (lSend) {
          lSend = false
          response.status(200).send({ message: 'Email enviado com sucesso!' })
        }

        pessoas[a].ok = true
      }

      lFim = true

      throw { message: 'log' }
    } catch (error) {
      if (!lFim) {
        response
          .status(400)
          .send({ message: 'Ocorreu uma falha de disparo de email.' })
      }

      await Mail.send(
        ['emails.mala_direta_log'],
        {
          mala_direta_log: emailHtml,
          pessoas
        },
        message => {
          message
            .to(_MAIL_EMPRESA)
            .from(_MAIL_EMPRESA)
            .subject('LOG - ' + titulo)
        }
      )
    }
  }
}

module.exports = MaladiretaController
