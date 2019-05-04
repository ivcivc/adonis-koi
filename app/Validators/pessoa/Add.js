'use strict'

const Antl = use('Antl')

class pessoaAdd {
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
      grupo: 'required|array'
      // endereco:
      //  'required_with_all:endereco.logradouro,endereco.compl,endereco.bairro,endereco.cidade,endereco.estado,endereco.cep'
      // 'endereco.*': 'exists:enderecos,logradouro,compl,bairro,cidade,estado,cep'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = pessoaAdd
