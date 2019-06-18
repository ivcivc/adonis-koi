'use strict'

const GrupoTransformer = use('App/Transformers/Pessoa/GrupoTransformer')

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * PessoaTransformer class
 *
 * @class PessoaTransformer
 * @constructor
 */
class PessoaTransformerPartial extends BumblebeeTransformer {
  static get defaultInclude () {
    return ['grupos']
  }

  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      nome: model.nome,
      rg: model.rg,
      cpf: model.cpf,
      tel_celular: model.tel_celular,
      situacao: model.situacao
    }
  }

  includeGrupos (o) {
    return this.collection(o.getRelated('grupos'), GrupoTransformer)
  }
}

module.exports = PessoaTransformerPartial
