'use strict'

const EnderecoTransformer = use('App/Transformers/Pessoa/EnderecoTransformer')
const GrupoTransformer = use('App/Transformers/Pessoa/GrupoTransformer')

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * PessoaTransformer class
 *
 * @class PessoaTransformer
 * @constructor
 */
class PessoaTransformer extends BumblebeeTransformer {
  static get defaultInclude () {
    return ['endereco', 'grupos']
  }

  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      nome: model.nome,
      certificado: model.certificado,
      cracha: model.cracha,
      cep: model.cep,
      rg: model.rg,
      cpf: model.cpf,
      sexo: model.sexo,
      camisa: model.camisa,
      estado_civil: model.estado_civil,
      profissao: model.profissao,
      dnasc: model.dnasc,
      tel_resid: model.tel_resid,
      tel_com: model.tel_com,
      tel_celular: model.tel_celular,
      tel_celular2: model.tel_celular2,
      email: model.email,
      email2: model.email2,
      facebook: model.facebook,
      instagram: model.instagram,
      skype: model.skype,
      nota: model.nota,
      situacao: model.situacao
    }
  }

  includeEndereco (end) {
    return this.item(end.getRelated('endereco'), EnderecoTransformer)
  }

  includeGrupos (o) {
    return this.collection(o.getRelated('grupos'), GrupoTransformer)
  }
}

module.exports = PessoaTransformer
