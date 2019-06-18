'use strict'

// const Antl = use('Antl')

class treinamentoValidators {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      nome: 'required|string|unique:treinamentos,nome',
      status: 'required|string',
      valor: 'number'
    }
  }

  get messages () {
    return {
      'nome.required': 'Informe o nome do Treinamento.',
      'nome.unique': 'Nome do Treinamento em duplicidade.',
      'status.required': 'Informe um status.'
    }
  }
}

module.exports = treinamentoValidators
