'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * LocalTransformer class
 *
 * @class LocalTransformer
 * @constructor
 */
class LocalTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      nome: model.nome
    }
  }
}

module.exports = LocalTransformer
