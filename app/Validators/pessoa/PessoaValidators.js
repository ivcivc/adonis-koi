'use strict'

const Antl = use('Antl')

class pessoaPessoaValidators {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      nome: 'required|string',
      cpf: 'required|cpfValid|unique:pessoas,cpf',
      certificado: 'required|string',
      cracha: 'required|string',
      email: 'required|email:pessoas',
      dnasc: 'date',
      grupos: 'required|array'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = pessoaPessoaValidators
