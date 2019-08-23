/* eslint-disable no-extend-native */
'use strict'

// const Receber = use('App/Models/Receber')
const Database = use('Database')

const ServiceReceber = use('App/Services/Receber')
const Pessoa = use('App/Models/Pessoa')

const ServiceGalaxyPay = use('App/Services/GalaxPay')
const ServiceParticipante = use('App/Services/Participante')

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

class ReceberController {
  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try {
      const { receber, card } = request.all()
      const items = receber.receberItems
      delete receber.receberItems

      receber.contaReceber_id = 1 // refazer

      let participante_id = receber.participante_id

      let cardInternalId = null

      let isNewcard = receber.cardInternalId === '_new'
      if (receber.cardInternalId === undefined) {
        isNewcard = true
      } else {
        cardInternalId = receber.cardInternalId
      }

      delete receber['cardInternalId']

      let cardEnviar = null

      if (receber.meioPgto === 'galaxpay') {
        if (isNewcard) {
          if (!card) {
            if (receber.meioPgto === 'koi') {
            } else {
              // eslint-disable-next-line no-throw-literal
              throw 'Cartão de crédito não informado.'
            }
          } else {
            cardEnviar = {
              number: card.cardNumber,
              holder: retira_acentos(card.cardName),
              expiryMonth: card.cardValidate.substr(0, 2),
              expiryYear: card.cardValidate.substr(3, 4),
              cvv: card.cardCode,
              brand: card.brand
            }
          }
        } else {
          cardEnviar = {
            internalId: cardInternalId
          }
        }
      }

      const valorParcela = receber.valorParcela
      const parcelas = receber.quantity
      const valor = receber.value

      if (valorParcela * parcelas < valor) {
        // eslint-disable-next-line no-throw-literal
        throw 'Valor da parcela inválido.'
      }
      let discounts = null

      if (parseFloat(parcelas * valorParcela).toFixedDown(2) > valor) {
        const desconto = parseFloat(
          (parcelas * valorParcela - valor).toFixed(2)
        ).toFixedDown(2)
        discounts = {}
        discounts[`${parcelas}`] = {
          valueDiscount: `${desconto}`,
          info: 'Ajuste de valor'
        }
      }

      let integrationIds = {}

      const receberModel = await new ServiceReceber().add(receber, trx)

      /* if (receberModel.meioPgto === 'koi') {
        for (let index in items) {
          const receberModelItems = await receberModel
            .receberItems()
            .create(items[index], trx)

          integrationIds[`${parseInt(index) + 1}`] = {
            integrationId: `${receberModelItems.id}`
          }
        }
      } */

      if (receberModel.meioPgto === 'galaxpay') {
        for (let index = 0; index < parcelas; index++) {
          let item = {
            payDay: receber.dateFirst,
            installmentNumber: parcelas,
            liquido: valorParcela,
            value: valorParcela,
            status: 'auto',
            statusDescription: 'Aguardando'
          }
          const receberModelItems = await receberModel
            .receberItems()
            .create(item, trx)

          integrationIds[`${parseInt(index) + 1}`] = {
            integrationId: `${receberModelItems.id}`
          }
        }
        // rceberItems = await receber.receberItems().create(items[0], trx)
      }

      if (receberModel.meioPgto === 'koi') {
        for (let index = 0; index < items.length; index++) {
          await receberModel.receberItems().create(items[index], trx)
        }
        // rceberItems = await receber.receberItems().create(items[0], trx)
      }

      const pessoa = await Pessoa.findOrFail(receber.pessoa_id)

      let pay = null

      if (receberModel.meioPgto === 'galaxpay') {
        const sendPay = {
          integrationId: `@@${receberModel.id}`,
          typeBill: 'contract',
          payday: receber.dateFirst,
          value: receber.valorParcela,
          quantity: `${receber.quantity}`,
          periodicity: 'monthly',
          paymentType: isNewcard ? 'newCard' : 'existingCard',
          integrationIds: integrationIds,
          Customer: {
            integrationId: `##${pessoa.id}`,
            document: pessoa.cpf,
            name: pessoa.nome,
            email: pessoa.email
          },
          Card: cardEnviar
        }

        if (discounts) {
          sendPay.discounts = discounts
        }

        console.log(sendPay)

        pay = await new ServiceGalaxyPay().createPaymentBillAndCustomer(sendPay)
      }

      await trx.commit()

      if (receberModel.meioPgto === 'galaxpay') {
        if (pay.type === false) {
          console.log('galax false')
          // deletar
          await new ServiceReceber().destroy(receberModel.id)
          await new ServiceParticipante().destroy(participante_id)
          throw pay
        } else {
          console.log('galax true')
          const paymentBillInternalId = pay.paymentBillInternalId
          await new ServiceReceber().update(receberModel.id, {
            transactionId: paymentBillInternalId,
            id: receberModel.id
          })
        }
      }

      if (receberModel.meioPgto === 'koi') {
        console.log('koi')
      }

      if (receberModel.meioPgto === 'galaxpay') {
        console.log('galaxpay.')

        // const receberItems = await receber.receberItems().create(items[0], trx)
      }

      /* const receberItems = await receberModel
        .receberItems()
        .createMany(items, trx)
      // const ri = receberItems.fetch()
      receberItems.forEach(e => console.log(e.id))
*/
      // await trx.rollback()

      return response.status(200).send('Transação concluída com sucesso!')
      // return res
    } catch (error) {
      await trx.rollback()
      return response.status(400).send(error)
    }
  }

  async update ({ params, request, response }) {
    try {
      const payload = request.all()
      const res = await new ServiceReceber().udpate(params.id, payload)

      return res
    } catch (error) {
      return response.status(400).send({ message: error.message })
    }
  }

  async destroy ({ params, response }) {
    try {
      await new ServiceReceber().destroy(params.id)
      return response.status(200).send('Conta a receber excluída com sucesso!')
    } catch (error) {
      return response.status(400).send({ message: error.message })
    }
  }

  async show ({ params, response }) {
    console.log('show')
    try {
      const res = await new ServiceReceber().get(params.id) // .with('receberItems')
      await res.load('receberItems')
      return res
    } catch (error) {
      return response.status(400).send({ message: 'Registro não localizado.' })
    }
  }

  async index ({ request, response }) {
    console.log('index')
    try {
      let payload = {}
      const status = request.input('status')
      const sortSelector = request.input('sortSelector')
      const sortDirection = request.input('sortDirection')
      if (status) {
        payload.status = status
      }
      if (sortDirection) {
        payload.sortDirection = sortDirection
        payload.sortSelector = sortSelector === undefined ? 'ASC' : sortSelector
      }

      const query = await new ServiceReceber().index(payload)
      return query
    } catch (error) {
      response.status(400).send(error.message)
    }
  }
}

module.exports = ReceberController
