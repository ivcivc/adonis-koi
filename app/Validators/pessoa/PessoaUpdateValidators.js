'use strict'

// const Antl = use('Antl')

class pessoaPessoaUpdateValidators {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      id: 'required',
      nome: 'required|string',
      cpf: 'required|cpfValid',
      rg: 'string',
      camisa: 'string',
      estado_civil: 'string',
      profissao: 'string',
      tel_resid: 'string',
      tel_com: 'string',
      tel_celular: 'string',
      tel_celular2: 'string',
      certificado: 'required|string',
      cracha: 'required|string',
      email: 'required|email:pessoas',
      email2: 'string|email',
      facebook: 'string',
      instagram: 'string',
      skype: 'string',
      dnasc: 'date',
      sexo: 'string',
      nota: 'string',
      situacao: 'string',
      grupos: 'required|array',
      endereco: 'object'
    }
  }

  get messages () {
    return {
      'id.required': 'O código é obrigatório.',
      'nome.required': 'O nome da pessoa é obrigatório.',
      'certificado.required': 'Informe o campo certificado.',
      'cracha.required': 'Informe o campo crachá.',
      'cpf.required': 'O CPF é obrigatório.',
      'nome.cpfValid': 'CPF inválido ou em duplicidade.',
      'status.required': 'Informe um status.'
    }
  }
}

module.exports = pessoaPessoaUpdateValidators
