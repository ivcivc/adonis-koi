/* eslint-disable no-throw-literal */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
'use strict'
const Mail = use('Mail')

const Database = use('Database')
const Pessoa = use('App/Models/Pessoa')

const Evento = use('App/Models/Evento')

const ServiceReceberItem = use('App/Models/ReceberItem')

const ServicePessoa = use('App/Services/Pessoa')
const ServiceEvento = use('App/Services/Evento')
const ServiceParticipante = use('App/Services/Participante')
const ServiceReceber = use('App/Services/Receber')
const ServiceGalaxyPay = use('App/Services/GalaxPay')

const receberModel = use('App/Models/Receber')
// const ServiceReceberItem = use('App/Services/ReceberItem')

const ServiceGrupo = use('App/Services/Grupo')

const axios = require('axios')

const Env = use('Env')

const _URL = Env.get('GALAXPAY_URL')
const _ID = Env.get('GALAXPAY_ID')
const _HASH = Env.get('GALAXPAY_HASH')

const _MAIL_EMPRESA = Env.get('MAIL_EMPRESA')

const Auth = {
  galaxId: _ID,
  galaxHash: _HASH
}

const moment = require('moment')
moment.locale('pt-BR')

// eslint-disable-next-line no-extend-native
Number.prototype.toFixedDown = function (digits) {
  var n = this - Math.pow(10, -digits) / 2
  n += n / Math.pow(2, 53)
  return n.toFixed(digits)
}

function retira_acentos (palavra) {
  const com_acento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ'
  const sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'
  let nova = ''
  for (let i = 0; i < palavra.length; i++) {
    if (com_acento.search(palavra.substr(i, 1)) >= 0) {
      nova += sem_acento.substr(com_acento.search(palavra.substr(i, 1)), 1)
    } else {
      nova += palavra.substr(i, 1)
    }
  }
  return nova
}

class SiteController {
  async addContrato ({ request, response }) {
    const {
      pessoa,
      evento_id,
      card,
      pagto,
      endereco,
      complemento
    } = request.all()

    let isTransaction = true

    const trx = await Database.beginTransaction()

    try {
      const grupoAluno = await new ServiceGrupo().getIdGrupoAluno()

      // const evento = new ServiceEvento().update(1, { siteExibir: 'SIM' })
      const evento = await new ServiceEvento().get(evento_id)
      if (evento.siteExibir === 'NÃO') {
        throw { message: 'Este evento não está disponível para venda.' }
      }
      if (pagto.parcela > evento.siteParcelas) {
        throw { message: 'Parcelamento não permitido para este Evento.' }
      }

      if (pagto.valorBase !== evento.valorBase) {
        throw {
          message: 'O valor do evento informado diferente da base de dados.'
        }
      }

      const valorParcelaCheck = pagto.parcela * pagto.valor
      if (
        valorParcelaCheck < evento.valorBase ||
        evento.valorBase - valorParcelaCheck > 0.12
      ) {
        throw {
          message: 'Valor da parcela incorreto.'
        }
      }

      let descontoCompra = 0.0

      let discounts = null

      if (parseFloat(valorParcelaCheck).toFixedDown(2) > evento.valorBase) {
        const desconto = parseFloat(
          (valorParcelaCheck - evento.valorBase).toFixed(2)
        ).toFixedDown(2)
        discounts = {}
        discounts[`${pagto.parcela}`] = {
          valueDiscount: `${desconto}`,
          info: 'Ajuste de valor'
        }
        descontoCompra = desconto < 0 ? desconto * -1 : desconto
      }

      const query = Pessoa.query()
      const pessoa_data = await query
        .where('cpf', 'LIKE', `${pessoa.cpf}`)
        .with('endereco')
        .with('grupos')
        .fetch()

      // eslint-disable-next-line no-unused-vars
      let pessoa_id = null

      const enderecoUpdate = {
        logradouro: endereco.logradouro,
        compl: endereco.compl,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        cep: endereco.cep
      }

      let email = null

      if (pessoa_data.rows.length > 0) {
        pessoa_id = pessoa_data.rows[0].id
        let pessoaJson = pessoa_data.rows[0].toJSON()
        pessoaJson.nome = pessoa.nome
        pessoaJson.email = pessoa.email
        pessoaJson.profissao = pessoa.profissao
        pessoaJson.sexo = pessoa.sexo
        pessoaJson.dnasc = pessoa.dnasc
        pessoaJson.estado_civil = pessoa.estado_civil
        pessoaJson.facebook = pessoa.facebook
        pessoaJson.instagram = pessoa.instagram
        pessoaJson.tel_celular = pessoa.tel_celular
        pessoaJson.camisa = pessoa.camisa
        pessoaJson.endereco = enderecoUpdate
        const pessoaGrupos = pessoaJson.grupos
        let pessoasGruposID = []
        pessoaGrupos.forEach(e => {
          pessoasGruposID.push(e.id)
        })
        pessoaJson.grupos = pessoasGruposID

        console.log('pessoaJSON ', pessoaJson)

        email = pessoa.email

        await new ServicePessoa().update(pessoaJson, trx)
      } else {
        // Adicionar um aluno
        pessoa.grupos = grupoAluno
        pessoa.endereco = endereco
        const addPessoa = await new ServicePessoa().add(pessoa, trx)
        pessoa_id = addPessoa.id
        email = addPessoa.email
      }

      // const email = pessoa_data.rows[0].email

      const participanteData = {
        evento_id,
        pessoa_id,
        padrinho_id: complemento.padrinho_id,
        consultor_id: complemento.consultor_id,
        pagarConsultor: true,
        treinamentoConcluido: true,
        parcelas: pagto.parcela,
        valorBase: evento.valorBase,
        TipoNegociacao_id: 1,
        status: 'ATIVO'
      }

      const addParticipante = await new ServiceParticipante().add(
        participanteData,
        trx
      )
      const participante_id = addParticipante.id

      const dataVenc = moment().format('YYYY-MM-DD')
      // const diaVenc = dataVenc.substr(8, 2)

      console.log('participante ', addParticipante.id)

      const receberData = {
        participante_id,
        periodicity: 'monthy',
        quantity: pagto.parcela,
        liquido: pagto.valorBase + parseFloat(descontoCompra),
        desconto: parseFloat(descontoCompra),
        value: evento.valorBase,
        dateFirst: moment().format('YYYY-MM-DD'),
        status: 'auto',
        statusDescription: null,
        link: null,
        brand: card.cardBrand,
        pessoa_id,
        contaReceber_id: 1,
        operator: null,
        operatorName: null,
        meioPgto: 'galaxpay'
      }

      const addReceber = await new ServiceReceber().add(receberData, trx)

      const receber_id = addReceber.id

      let integrationIds = {}

      console.log('card.parcelas= ', pagto.parcela)

      for (let i = 0; i < pagto.parcela; i++) {
        let valor = pagto.valor
        let desconto = 0.0
        if (i + 1 === pagto.parcela) {
          desconto = parseFloat(descontoCompra)
        }

        console.log('construindo parcela: ', i)
        const items = await addReceber.receberItems().create(
          {
            installmentNumber: i + 1,
            tid: null,
            payDay: moment().format('YYYY-MM-DD'),
            status: 'auto',
            brand: card.cardBrand,
            liquido: valor,
            desconto: desconto,
            value: valor - desconto,
            receber_id: receber_id
          },
          trx
        )
        integrationIds[`${parseInt(i) + 1}`] = { integrationId: `${items.id}` }
      }

      console.log('integrationIds: ', integrationIds)

      console.log('commitando....')

      await trx.commit()
      isTransaction = false

      const valorPagar = pagto.valor.toFixed(2)

      const sendPay = {
        integrationId: `@@${receber_id}`,
        typeBill: 'contract',
        payday: dataVenc,
        value: valorPagar,
        quantity: `${pagto.parcela}`,
        periodicity: 'monthly',
        paymentType: 'newCard',
        integrationIds: integrationIds,
        Customer: {
          integrationId: `##${pessoa_id}`,
          document: pessoa.cpf,
          name: pessoa.nome,
          email: pessoa.email
        },
        Card: {
          number: card.cardNumber,
          holder: retira_acentos(card.cardName),
          expiryMonth: card.cardValidate.substr(0, 2),
          expiryYear: card.cardValidate.substr(2, 4),
          cvv: card.cardCode,
          brand: card.cardBrand
        }
      }

      if (discounts) {
        sendPay.discounts = discounts
      }

      console.log('pagamento..... ')
      const pay = await new ServiceGalaxyPay().createPaymentBillAndCustomer(
        sendPay
      )

      let lEnviarEmail = false

      console.log('saindo do pagamento ', pay)

      if (pay.type === false) {
        console.log('galax false')
        // deletar
        await new ServiceReceber().destroy(receber_id)
        await new ServiceParticipante().destroy(participante_id)
        throw pay
      } else {
        lEnviarEmail = true
        console.log('galax true')
        const paymentBillInternalId = pay.paymentBillInternalId
      }

      if (lEnviarEmail) {
        if (evento.emailBoasVindas) {
          if (evento.emailBoasVindas.length > 0) {
            console.log('titulo tamanho ', evento.emailBoasVindas.length)
            await Mail.send(
              ['emails.boas_vindas'],
              {
                emailBoasVindas: evento.emailBoasVindas
              },
              message => {
                message
                  .to(_MAIL_EMPRESA)
                  .from(email)
                  .subject(evento.emailBoasVindasTitulo)
              }
            )
          }
        }
      }

      console.log('status ok')

      return response.status(200).send(pay)
    } catch (e) {
      console.log('falha na transação....', e)
      if (isTransaction) {
        await trx.rollback()
      }
      return response.status(400).send(e)
    }
  }

  async updateContrato ({ request, response }) {
    const { evento_id } = request.all()
    const evento = await new ServiceEvento().get(evento_id)

    return evento.valorBase
    // return new ServiceEvento().update(1, { siteExibir: 'SIM' })
  }

  async getEventosSite ({ request }) {
    const query = Evento.query()
    query.where('siteExibir', 'LIKE', 'SIM')
    const eventos = await query.fetch()

    return eventos
  }

  async getBandeiras () {
    const bandeiras = await new ServiceGalaxyPay().getBandeiras()
    return bandeiras
  }

  async getCPF ({ request }) {
    const { cpf } = request.all()
    console.log('buscando cpf ')
    const retorno = await new ServiceGalaxyPay().getCPF(cpf)

    return retorno
  }

  async getPaymentBillInfo (ID) {
    // Retorna todas as informações do pagamento e suas transações.
    console.log('entrei em getPaymentBillInfo')
    const url = `${_URL}/getPaymentBillInfo`
    const data = {
      method: 'get',
      responseType: 'json',
      url,
      data: {
        Auth,
        Request: {
          integrationId: `${ID}`
        }
      }
    }
    const retorno = await axios(data)
      .then(res => {
        return res.data
      })
      .catch(e => {
        return e.data
      })
    console.log('retornei getPaymentBillInfo() ', retorno)
    return retorno
  }

  async retorno ({ request, response }) {
    const r = request.all()
    console.log(r)
    console.log('contrato billInternalId= ', r.data.billInternalId)
    console.log('contrato billIntegrationId = ', r.data.billIntegrationId)
    // r.data.billInternalId (receber - numero do contrado campo tabela transactionId)
    // r.data.billIntegrationId (o mesmo ID DA CONTA A RECEBER ) CAMPO: transactionInternalId
    // r.data.transactionIntegrationId (receber_items: paymentBillIntegrationId) o mesmo que o numero do ID )
    console.log('/transação transactionIntegrationId= ')
    // const ID = parseInt(r.data.billIntegrationId.replace('@@', '')).
    const ID = parseInt(r.data.transactionIntegrationId.replace('@@', ''))

    try {
      const registro = await ServiceReceberItem.findOrFail(ID)
      console.log('ID ', registro.id)
      registro.paymentBillInternalId = r.data.transactionInternalId // id da parcela
      registro.paymentBillIntegrationId = r.data.transactionIntegrationId // 2@
      registro.authorizationCode = r.data.authorizationCode
      registro.status = r.data.status
      registro.statusDescription = r.data.statusDescription
      registro.lastUpdateDate = r.data.statusInsertDate

      registro.value = r.data.value
      registro.payDay = r.data.payday

      const receber_id = registro.receber_id

      console.log('registro...... salvando....*.')

      await registro.save()

      const billInternalId = r.data.billInternalId
      const billIntegrationId = r.data.billIntegrationId

      console.log('contrato... ', billInternalId)
      console.log('URL= ', _URL)
      const contrato = await this.getPaymentBillInfo(billIntegrationId)

      console.log('contrato.... receber_id= ', receber_id)
      /// console.log(contrato)

      const receber = await receberModel.findOrFail(receber_id)
      receber.status = contrato.paymentBill.status
      receber.statusDescription = contrato.paymentBill.statusDescription
      receber.save()

      await this.updateTransactions(billIntegrationId)

      console.log('status contrato= ', contrato.paymentBill.status)

      // console.log('contrato= ', contrato.toJSON())

      return response.status(200).send({ message: 'Ok' })
    } catch (e) {
      console.log('excessão gerada ')
      console.log('error ', e.message)
      return response.status(400).send({ message: 'Não localizado!' })
    }
  }

  async updateTransactions (receber_id) {
    // { request, response }
    // let { receber_id, integrationId } = request.all()

    // integrationId = '##' + integrationId

    try {
      const contrato = await this.getPaymentBillInfo(receber_id)

      if (!contrato.type) {
        throw 'Contrato não localizado!'
      }

      const receber = await receberModel.findOrFail(
        receber_id.replace('@@', '')
      )
      receber.status = contrato.paymentBill.status
      receber.statusDescription = contrato.paymentBill.statusDescription
      receber.transactionId = contrato.paymentBill.internalId
      receber.transactionInternalId = contrato.paymentBill.integrationId
      receber.save()

      // Contas a receber items
      for (let i = 0; i < contrato.paymentBill.transactions.length; i++) {
        const transacao = contrato.paymentBill.transactions[i]
        const item = await ServiceReceberItem.find(transacao.integrationId)
        if (item) {
          item.paymentBillInternalId = transacao.billInternalId
          item.paymentBillIntegrationId = transacao.integrationId
          item.payDay = transacao.payDay
          item.installmentNumber = transacao.installmentNumber
          item.tid = transacao.tid
          item.additionalInfo = transacao.additionalInfo
          item.customerInternalId = transacao.customerInternalId
          item.customerIntegrationId = transacao.customerIntegrationId
          item.cardInternalId = transacao.cardInternalId
          item.link = transacao.link
          item.brand = transacao.brand
          item.lastUpdateDate = transacao.lastUpdateDate
          item.authorizationCode = transacao.authorizationCode
          item.status = transacao.status
          item.statusDescription = transacao.statusDescription
          item.save()
        }
      }
    } catch (e) {
      // response.status(400).send(e.message)
      console.log('error apresentado: ', error.message)
    }
  }
}

module.exports = SiteController
