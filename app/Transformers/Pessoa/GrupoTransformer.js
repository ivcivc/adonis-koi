'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * GrupoTransformer class
 *
 * @class GrupoTransformer
 * @constructor
 */
class GrupoTransformer extends BumblebeeTransformer {
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

module.exports = GrupoTransformer
