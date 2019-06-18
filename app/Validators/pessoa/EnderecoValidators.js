'use strict'

const Antl = use('Antl')

class pessoaEnderecoValidators {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      endereco: 'enderecoValid'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = pessoaEnderecoValidators
