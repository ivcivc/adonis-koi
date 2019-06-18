'use strict'

const Database = use('Database')

const Pessoa = use('App/Models/Pessoa')

const PessoaTransformer = use('App/Transformers/Pessoa/PessoaTransformer')
const PessoaTransformerPartial = use(
  'App/Transformers/Pessoa/PessoaTransformerPartial'
)

class PessoaController {
  /**
   * Show a list of all pessoas.
   * GET pessoas
   */
  async index ({ request, transform }) {
    const page = request.input('page')
    // const perPage = request.input('perPage')
    const limit = request.input('limit')
    const { nome, cpf, grupos, isLocalizar, isLookup } = request.all()
    const sortSelector = request.input('sortSelector')
    const sortDirection = request.input('sortDirection')

    let query

    if (isLocalizar || isLookup) {
      query = Pessoa.query().with('grupos')
    } else {
      query = Pessoa.query()
        .with('grupos')
        .with('endereco')
    }

    if (sortSelector) {
      query.orderBy(sortSelector, sortDirection)
    } else {
      query.orderBy('nome', 'ASC')
    }

    if (nome) {
      query.where('nome', 'LIKE', `%${nome}%`)
    }

    if (cpf) {
      query.where('cpf', 'LIKE', `%${cpf}%`)
    }

    if (grupos) {
      query.whereHas('grupos', endQuery => {
        endQuery.where('nome', 'IN', grupos)
      })
    }

    let pessoas = null

    if (isLookup) {
      pessoas = await query.paginate(page, limit)
    } else {
      pessoas = await query.paginate(page, limit)
    }

    if (isLocalizar) {
      return transform.paginate(pessoas, PessoaTransformerPartial)
    } else {
      return pessoas
    }
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
        endereco = data.endereco
      }
      delete data['endereco']

      let grupos = null
      grupos = data.grupos
      delete data['grupos']

      const pessoa = await Pessoa.create(data, trx)

      if (endereco) {
        endereco.nr = '.'
        endereco.pessoa_id = pessoa.id
        await pessoa.endereco().create(endereco, trx)
      }

      await pessoa.grupos().attach(grupos, null, trx)

      await trx.commit()

      return transform.item(pessoa, PessoaTransformer)
    } catch (e) {
      await trx.rollback()

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
      console.log(e)
      return response.status(400).send(e.message)
    }
  }

  /**
   * Display a single pessoa.
   * GET pessoas/:id
   */

  async show ({ params, response, transform }) {
    try {
      const pessoa = await Pessoa.findOrFail(params.id)

      return transform.item(pessoa, PessoaTransformer)
    } catch (e) {
      return response
        .status(400)
        .send('Não foi possível exibir o pessoa solicitada.')
    }
  }

  /**
   * Update pessoa details.
   * PUT or PATCH pessoas/:id
   */
  async update ({ transform, request, response, params }) {
    const data = request.all()
    const trx = await Database.beginTransaction()

    try {
      let endereco = null

      if (data.endereco) {
        endereco = data.endereco
      }
      delete data['endereco']

      let grupos = null
      grupos = data.grupos
      delete data['grupos']

      let pessoa = await Pessoa.findOrFail(params.id)

      pessoa.merge(data)

      let end = await pessoa.endereco().fetch()

      if (end) {
        await end.delete()
      }

      if (endereco) {
        await pessoa.endereco().create(endereco, null, trx)
      }

      await pessoa.grupos().sync(grupos, null, trx)

      // await pessoa.endereco().save(trx)
      await pessoa.save(trx)

      await trx.commit()

      const busca = await Pessoa.find(params.id)
      return busca
      // return transform.item(busca, PessoaTransformer)
    } catch (e) {
      console.log('falhou.....>>')
      await trx.rollback()

      if (e.name === 'ModelNotFoundException') {
        return response.status(400).send('Pessoa não localizada!')
      }

      if (e.name === 'TypeError') {
        return response.status(400).send(e.message)
      } else {
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            console.log(e)
            return response
              .status(400)
              .send('Duplicidade de registro detectada.')
        }
      }
      console.log('erro:', e)
      return response.status(400).send(e.message)
    }
  }

  /**
   * Delete a pessoa with id.
   * DELETE pessoas/:id
   */
  async destroy ({ params, request, response }) {
    const id = params.id
    try {
      const pessoa = await Pessoa.find(id)
      await pessoa.delete()
      return response.status(200).send('Excluído com sucesso!')
    } catch (error) {
      return response.status(400).send('Não foi possível excluir.')
    }
  }
}

module.exports = PessoaController
