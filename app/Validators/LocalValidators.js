'use strict'

// const Antl = use('Antl')

class localValidators {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      nome: 'required|string|unique:locals',
      status: 'required|string',
      contato: 'string',
      tel_com: 'string',
      tel_com2: 'string',
      tel_celular: 'string',
      tel_celular2: 'string',
      email: 'email',
      logradouro: 'string',
      compl: 'string',
      bairro: 'string',
      cidade: 'string',
      estado: 'string|max:2',
      cep: 'string',
      nota: 'string'
    }
  }

  get messages () {
    return {
      'nome.required': 'Informe o nome do Local.',
      'nome.unique': 'Nome do Local em duplicidade.',
      'status.required': 'Informe um status.'
    }
  }
}

module.exports = localValidators
