'use strict'

const Pessoa = use('App/Models/Pessoa')
class PessoaController {
  /**
   * Show a list of all pessoas.
   * GET pessoas
   */

  async index ({ request }) {
    const { page } = request.get()

    const pessoa = await Pessoa.query().paginate(page)

    return pessoa
  }

  /**
   * Create/save a new pessoa.
   * POST pessoas
   */

  async store ({ request, response }) {
    const data = request.all()

    let endereco = null
    if (data.endereco) {
      endereco = data.endereco
      delete data['endereco']
    }
    console.log(data)
    const pessoa = await Pessoa.create(data)

    if (endereco) {
      pessoa.endereco().attach(endereco)
      console.log(pessoa.endereco())
    }
    return pessoa
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
