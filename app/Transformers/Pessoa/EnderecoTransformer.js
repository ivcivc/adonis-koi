'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * EnderecoTransformer class
 *
 * @class EnderecoTransformer
 * @constructor
 */
class EnderecoTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      logradouro: model.logradouro,
      compl: model.compl,
      bairro: model.bairro,
      cidade: model.cidade,
      estado: model.estado,
      cep: model.cep
    }
  }
}

module.exports = EnderecoTransformer
