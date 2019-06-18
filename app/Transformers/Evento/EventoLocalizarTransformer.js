'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * EventoTransformer class
 *
 * @class EventoTransformer
 * @constructor
 */
class EventoLocalizarTransformer extends BumblebeeTransformer {
  static get defaultInclude () {
    return ['local', 'treinamento', 'participantes']
  }
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      nome: model.nome,
      dInicio: model.dInicio,
      dTermino: model.dTermino,
      status: model.status
    }
  }

  includeLocal (o) {
    const LocalTransformer = use('App/Transformers/Evento/LocalTransformer')
    return this.item(o.getRelated('local'), LocalTransformer)
  }

  includeTreinamento (o) {
    const TreinamentoTransformer = use(
      'App/Transformers/Evento/TreinamentoTransformer'
    )
    return this.item(o.getRelated('treinamento'), TreinamentoTransformer)
  }

  includeParticipantes (o) {
    const transformer = use('App/Transformers/Evento/ParticipanteTransformer')
    return this.collection(o.getRelated('participantes'), transformer)
  }
}

module.exports = EventoLocalizarTransformer
