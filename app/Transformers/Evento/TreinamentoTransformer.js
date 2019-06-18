'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * TreinamentoTransformer class
 *
 * @class TreinamentoTransformer
 * @constructor
 */
class TreinamentoTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      nome: model.nome,
      valor: model.valor
    }
  }
}

module.exports = TreinamentoTransformer
