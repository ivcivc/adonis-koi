/* eslint-disable no-throw-literal */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
'use strict'
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

const Auth = {
  galaxId: _ID,
  galaxHash: _HASH
}

const moment = require('moment')
moment.locale('pt-BR')

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
      if (pagto.parcelas > evento.siteParcelas) {
        throw { message: 'Parcelamento não permitido para este Evento.' }
      }

      if (pagto.valorBase !== evento.valorBase) {
        throw {
          message: 'O valor do evento informado diferente da base de dados.'
        }
      }

      const valorParcelaCheck = pagto.parcela * pagto.valor
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

        await new ServicePessoa().update(pessoaJson, trx)
      } else {
        // Adicionar um aluno
        pessoa.grupos = grupoAluno
        pessoa.endereco = endereco
        const addPessoa = await new ServicePessoa().add(pessoa, trx)
        pessoa_id = addPessoa.id
      }

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
        liquido: pagto.valorBase,
        desconto: descontoCompra,
        value: evento.valorBase - descontoCompra,
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

      console.log('card.parcelas= ', card.parcelas)

      for (let i = 0; i < card.parcelas; i++) {
        let valor = pagto.valor
        console.log('construindo parcela: ', i)
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
        integrationIds[`${parseInt(i) + 1}`] = { integrationId: `${items.id}` }
      }

      console.log('integrationIds: ', integrationIds)

      console.log('commitando....')

      await trx.commit()
      isTransaction = false

      const valorPagar = pagto.valor.toFixed(2)

      const sendPay = {
        integrationId: `##${receber_id}`,
        typeBill: 'contract',
        payday: dataVenc,
        value: valorPagar,
        quantity: `${pagto.parcela}`,
        periodicity: 'monthly',
        paymentType: 'newCard',
        integrationIds: integrationIds,
        Customer: {
          integrationId: `#${pessoa_id}`,
          document: pessoa.cpf,
          name: pessoa.nome,
          email: pessoa.email
        },
        Card: {
          number: card.cardNumber,
          holder: card.cardName,
          expiryMonth: card.cardValidate.substr(0, 2),
          expiryYear: card.cardValidate.substr(2, 4),
          cvv: card.cardCode,
          brand: card.cardBrand
        }
      }
      console.log('pagamento..... ')
      const pay = await new ServiceGalaxyPay().createPaymentBillAndCustomer(
        sendPay
      )

      console.log('saindo do pagamento ', pay)

      if (pay.type === false) {
        console.log('galax false')
        // deletar
        await new ServiceReceber().destroy(receber_id)
        throw pay
      } else {
        console.log('galax true')
        const paymentBillInternalId = pay.paymentBillInternalId
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
          internalId: `${ID}`
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
    console.log('data = ', r.data.billInternalId)
    console.log('transação= ', r.data.transactionIntegrationId)
    const ID = parseInt(r.data.transactionIntegrationId)

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

      console.log('registro...... salvando....')

      await registro.save()

      const billInternalId = r.data.billInternalId

      console.log('contrato... ', billInternalId)
      console.log('URL= ', _URL)
      const contrato = await this.getPaymentBillInfo(billInternalId)

      console.log('contrato.... receber_id= ', receber_id)
      /// console.log(contrato)

      const receber = await receberModel.findOrFail(receber_id)
      receber.status = contrato.paymentBill.status
      receber.statusDescription = contrato.paymentBill.statusDescription
      receber.save()

      console.log('status contrato= ', contrato.paymentBill.status)

      // console.log('contrato= ', contrato.toJSON())

      return response.status(200).send({ message: 'Ok' })
    } catch (e) {
      console.log('excessão gerada ')
      console.log('error ', e.message)
      return response.status(400).send({ message: 'Não localizado!' })
    }
  }
}

module.exports = SiteController
