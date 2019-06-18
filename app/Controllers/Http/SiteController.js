/* eslint-disable no-throw-literal */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
'use strict'
const Database = use('Database')
const Pessoa = use('App/Models/Pessoa')

const ServicePessoa = use('App/Services/Pessoa')
const ServiceEvento = use('App/Services/Evento')
const ServiceParticipante = use('App/Services/Participante')

class SiteController {
  async addContrato ({ request, response }) {
    const { pessoa, evento_id, card } = request.all()

    const trx = await Database.beginTransaction()

    try {
      const query = Pessoa.query()
      const pessoa_data = await query
        .where('cpf', 'LIKE', `${pessoa.cpf}`)
        .fetch()

      // eslint-disable-next-line no-unused-vars
      let pessoa_id = null

      if (pessoa_data.rows.length > 0) {
        pessoa_id = pessoa_data.rows[0].id
      } else {
        // Adicionar um aluno
        const grupoAluno = [1]
        pessoa.grupos = grupoAluno
        const addPessoa = await new ServicePessoa().add(pessoa, trx)
        pessoa_id = addPessoa.id
      }
      // const evento = new ServiceEvento().update(1, { siteExibir: 'SIM' })
      const evento = await new ServiceEvento().get(evento_id)

      const participanteData = {
        evento_id,
        pessoa_id,
        parcelas: card.parcelas,
        valorBase: evento.valorBase,
        TipoNegociacao_id: 1,
        status: 'ATIVO'
      }

      const addParticipante = await new ServiceParticipante().add(
        participanteData
      )

      console.log('participante ', addParticipante.id)

      await trx.commit()

      return response.status(200).send(evento)
    } catch (e) {
      await trx.rollback()
      return response.status(400).send(e)
    }
  }

  async updateContrato ({ request, response }) {
    const { evento_id } = request.all()
    const evento = await new ServiceEvento().get(evento_id)

    return evento.valorBase
    // return new ServiceEvento().update(1, { siteExibir: 'SIM' })
  }

  validarPagamento (evento, pagto) {
    if (evento.valorBase !== pagto.valorBase) {
      // eslint-disable-next-line no-throw-literal
      throw { message: 'Valor do investimento do evento não confere.' }
    }

    if (pagto.parcelas === 1) {
      pagto.parcelas = evento.valorBase
      return pagto
    }

    let valorCadaParcela = pagto.valorBase / pagto.parcelas
    let temDiferenca= this.checkDiferencaParcela(valorCadaParcela, pagto.valor)
    let diferenca = pagto.valor - valorCadaParcela
    let arrDiscontos = []
    for (let i = 0; i < pagto.parcelas; i++) {
      if (i + 1 === pagto.parcelas) {
        let valorParcial = 0
        arrayParcelas.forEach(e => {
          valorParcial += e.valor
        })
      }

    }

    }
  }

  checkDiferencaParcela (valor1, valor2) {
    if (valor1 === valor2) return false
    let diferenca = valor1 > valor2 ? valor1 - valor2 : valor2 - valor1
    if (diferenca <= 0.1) return true
    throw {
      message: 'Valor da parcela com diferença superior à 10 centavos.'
    }
  }
}

module.exports = SiteController
