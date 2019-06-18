'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

// const PessoaTransformerPartial = use('App/Transformers/Pessoa/PessoaTransformerPartial')

/**
 * ParticipanteTransformer class
 *
 * @class ParticipanteTransformer
 * @constructor
 */
class ParticipanteTransformer extends BumblebeeTransformer {
  static get defaultInclude () {
    return ['consultor', 'Pessoa']
  }
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      evento_id: model.evento_id,
      pessoa_id: model.pessoa_id,
      consultor_id: model.consultor_id,
      pagarConsultor: model.pagarConsultor,
      parcelas: model.parcelas,
      total: model.total,
      status: model.status,
      tipoNegociacao_id: model.tipoNegociacao_id
    }
  }

  includeConsultor (o) {
    const PessoaTransformerPartial = use(
      'App/Transformers/Pessoa/PessoaTransformerPartial'
    )
    return this.item(o.getRelated('consultor'), PessoaTransformerPartial)
  }

  includePessoa (o) {
    const PessoaTransformerPartial = use(
      'App/Transformers/Pessoa/PessoaTransformerPartial'
    )
    return this.item(o.getRelated('pessoa'), PessoaTransformerPartial)
  }
}

module.exports = ParticipanteTransformer
