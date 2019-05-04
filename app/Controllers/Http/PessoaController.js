'use strict'

const Database = use('Database')

const Pessoa = use('App/Models/Pessoa')
const PessoaTransformer = use('App/Transformers/Pessoa/PessoaTransformer')

class PessoaController {
  /**
   * Show a list of all pessoas.
   * GET pessoas
   */

  async index ({ request, transform }) {
    const { page } = request.get()

    const pessoa = await Pessoa.query().paginate(page)

    return transform.collection(pessoa, PessoaTransformer)
  }

  /**
   * Create/save a new pessoa.
   * POST pessoas
   */

  async store ({ request, response, transform }) {
    const data = request.all()
    const trx = await Database.beginTransaction()

    try {
      let endereco = null

      if (data.endereco) {
        console.log('endereço ', data.endereco)
        endereco = data.endereco
      }
      delete data['endereco']

      let grupo = null

      if (data.grupo === undefined) {
        throw new TypeError('O grupo não foi informado.')
      }

      if (data.grupo) {
        grupo = data.grupo
        delete data['grupo']
      }

      const pessoa = await Pessoa.create(data, trx)

      if (endereco) {
        endereco.nr = '.'
        endereco.pessoa_id = pessoa.id
        await pessoa.endereco().create(endereco, trx)
      }

      if (grupo) {
        await pessoa.grupos().attach(grupo, null, trx)
      }

      await trx.commit()

      return transform.item(pessoa, PessoaTransformer)
    } catch (e) {
      await trx.rollback()

      if (e.name === 'TypeError') {
        console.log('TypeError++++++++++++++++++++++++++++++++++++')
        return response.status(401).send({ message: e.message })
      } else {
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            return response
              .status(401)
              .send({ message: 'Duplicidade de registro detectada.' })
        }
      }
      console.log(e)
      return response.status(401).send(e.message)
    }
  }

  /**
   * Display a single pessoa.
   * GET pessoas/:id
   */

  async show ({ params, response }) {
    try {
      const pessoa = await Pessoa.findOrFail(params.id)

      return pessoa
    } catch (e) {
      return response
        .status(401)
        .send('Não foi possível exibir o pessoa solicitada.')
    }
  }

  /**
   * Render a form to update an existing pessoa.
   * GET pessoas/:id/edit
   */
  async edit ({ params, request, response, view }) {}

  /**
   * Update pessoa details.
   * PUT or PATCH pessoas/:id
   */
  async update ({ params, request, response }) {}

  /**
   * Delete a pessoa with id.
   * DELETE pessoas/:id
   */
  async destroy ({ params, request, response }) {}
}

module.exports = PessoaController
