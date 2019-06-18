'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * PessoaTransformer class
 *
 * @class PessoaTransformer
 * @constructor
 */
class PessoaTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      nome: model.nome,
      rg: model.rg,
      cpf: model.cpf,
      situacao: model.situacao
    }
  }
}

module.exports = PessoaTransformer
