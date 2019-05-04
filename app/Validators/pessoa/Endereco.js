'use strict'

const Antl = use('Antl')

class pessoaEndereco {
  get validateAll () {
    return true
  }

  get rules () {
    // const userId = this.ctx.params.id
    const data = this.ctx.request.all()
    console.log('DATA ENDEREÇO ', data.endereco)
    if (data.endereco === null) {
      // throw 'Endereço nulo'
    }

    return {
      endereco: 'required|enderecoValid'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = pessoaEndereco
