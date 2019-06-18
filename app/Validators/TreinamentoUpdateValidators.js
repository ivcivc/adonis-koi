'use strict'

const Antl = use('Antl')

class treinamentoUpdateValidators {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      id: 'required',
      nome: 'required|string',
      status: 'required|string',
      valor: 'number'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = treinamentoUpdateValidators
