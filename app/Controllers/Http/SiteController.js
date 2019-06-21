/* eslint-disable no-throw-literal */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
'use strict'
const Database = use('Database')
const Pessoa = use('App/Models/Pessoa')

const ServicePessoa = use('App/Services/Pessoa')
const ServiceEvento = use('App/Services/Evento')
const ServiceParticipante = use('App/Services/Participante')
const ServiceReceber = use('App/Services/Receber')
const ServiceGalaxyPay = use('App/Services/GalaxPay')
// const ServiceReceberItem = use('App/Services/ReceberItem')

const ServiceGrupo = use('App/Services/Grupo')

const moment = require('moment')
moment.locale('pt-BR')

class SiteController {
  async addContrato ({ request, response }) {
    const { pessoa, evento_id, card, pagto } = request.all()

    const trx = await Database.beginTransaction()

    try {
      const grupoAluno = await new ServiceGrupo().getIdGrupoAluno()

      // const evento = new ServiceEvento().update(1, { siteExibir: 'SIM' })
      const evento = await new ServiceEvento().get(evento_id)
      if (evento.siteExibir === 'NÃO') {
        throw { message: 'Este evento não está disponível para venda.' }
      }
      if (pagto.parcelas > evento.siteParcelas) {
        throw { message: 'Parcelamento não permitido para este Evento.' }
      }

      if (pagto.valorBase !== evento.valorBase) {
        throw {
          message: 'O valor do evento informado diferente da base de dados.'
        }
      }

      const valorParcelaCheck = pagto.parcelas * pagto.valor
      if (
        valorParcelaCheck > evento.valorBase ||
        valorParcelaCheck > evento.valorBase ||
        evento.valorBase - valorParcelaCheck > 0.12
      ) {
        throw {
          message: 'Valor da parcela incorreto.'
        }
      }

      const descontoCompra = evento.valorBase - valorParcelaCheck

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
        pessoa.grupos = grupoAluno
        const addPessoa = await new ServicePessoa().add(pessoa, trx)
        pessoa_id = addPessoa.id
      }

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
      const participante_id = addParticipante.id

      const dataVenc = moment().format('YYYY-MM-DD')
      // const diaVenc = dataVenc.substr(8, 2)

      console.log('participante ', addParticipante.id)

      const receberData = {
        participante_id,
        periodicity: 'monthy',
        quantity: card.parcelas,
        liquido: evento.valorBase,
        desconto: descontoCompra,
        dateFirst: moment().format('YYYY-MM-DD'),
        status: 'auto',
        statusDescription: null,
        link: null,
        brand: card.cardBrand,
        value: evento.valorBase - descontoCompra,
        pessoa_id,
        contaReceber_id: 1,
        operator: null,
        operatorName: null
      }

      const addReceber = await new ServiceReceber().add(receberData, trx)

      const receber_id = addReceber.id

      let integrationIds = {}

      for (let i = 0; i < card.parcelas; i++) {
        let valor = pagto.valor
        const items = await addReceber.receberItems().create(
          {
            installmentNumber: i + 1,
            tid: null,
            payDay: moment().format('YYYY-MM-DD'),
            status: 'auto',
            brand: card.cardBrand,
            value: valor,
            receber_id: receber_id
          },
          trx
        )
        integrationIds[`${i + 1}`] = { integrationId: `${items.id}` }
      }

      console.log(integrationIds)

      await trx.commit()

      const valorPagar = pagto.valor.toFixed(2)

      const sendPay = {
        integrationId: `${receber_id}##`,
        typeBill: 'contract',
        payday: dataVenc,
        value: valorPagar,
        quantity: `${pagto.parcelas}`,
        periodicity: 'monthly',
        paymentType: 'newCard',
        integrationIds: integrationIds,
        Customer: {
          integrationId: `${pessoa_id}`,
          document: '43145984926',
          name: 'CLIENTE KOI 2',
          email: 'suporte.integracao@galaxpay.com.br',
          phone: '(31)4020-1512',
          Address: {
            zipCode: '30411-325',
            street: 'Rua platina',
            number: '1375',
            neighborhood: 'Prado',
            city: 'Belo Horizonte',
            state: 'MG',
            complement: '2º andar'
          }
        },
        Card: {
          number: '4716 0248 9944 1650',
          holder: 'Cliente de exemplo Galax Pay',
          expiryMonth: '04',
          expiryYear: '2023',
          cvv: '541',
          brand: 'visa'
        }
      }

      const pay = await new ServiceGalaxyPay().createPaymentBillAndCustomer(
        sendPay
      )

      return response.status(200).send(pay)
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
}

module.exports = SiteController
