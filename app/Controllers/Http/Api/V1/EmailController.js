'use strict'

const Mail = use('Mail')
const Participante = use('App/Models/Participante')
const Evento = use('App/Models/Evento')
const ServiceEvento = use('App/Services/Evento')

const Env = use('Env')
const queue = require('queue')

class EmailController {
  async dispararEmailInformativo ({ request, response }) {
    const payload = request.all()
    const evento_id = payload.id

    const eventoModel = await Evento.findOrFail(evento_id)

    await new ServiceEvento().update(eventoModel.id, payload)

    const _MAIL_EMPRESA = Env.get('MAIL_EMPRESA')
    const participante = await Participante.query()
      .with('pessoa')
      .with('evento')
      .where('evento_id', '=', evento_id)
      .andWhere('status', '=', 'ATIVO')
      .fetch()
    /*
    const q = queue()
    let lista = []

    for (let a = 0; a < participante.rows.length; a++) {
      let r = await participante.rows[a].pessoa().fetch()
      let evento = await participante.rows[a].evento().fetch()
      q.push(async () => {
        return new Promise(async function (resolve, reject) {
          lista.push(
            await Mail.send(
              ['emails.informativo'],
              {
                emailInformativo: evento.emailInformativo
              },
              message => {
                message
                  .to('ivan.a.oliveira@terra.com.br')
                  .from(r.email)
                  .subject(evento.emailInformativoTitulo)
              }
            )
          )

          console.log('resolvendo ', a)
          resolve()
        })
      })
    }

    q.timeout = 1000

    q.on('success', function (result, job) {
      console.log('job finished processing:', job.toString().replace(/\n/g, ''))
    })

    q.on('timeout', function (next, job) {
      console.log('job timed out:', job.toString().replace(/\n/g, ''))
      next()
    })

    console.log('startando ')
    q.start(function (err) {
      if (err) throw err
      console.log('all done:', lista)
    })
*/
    for (let a = 0; a < participante.rows.length; a++) {
      console.log('for ', a)
      let r = await participante.rows[a].pessoa().fetch()
      let evento = await participante.rows[a].evento().fetch()
      console.log('enviando email nr. ', a)
      await Mail.send(
        ['emails.informativo'],
        {
          emailInformativo: evento.emailInformativo
        },
        message => {
          message
            .to(_MAIL_EMPRESA)
            .from(r.email)
            .subject(evento.emailInformativoTitulo)
        }
      )
      console.log('enviado email ', a)
    }

    response.status(200).send('ok')
  }
}

module.exports = EmailController
