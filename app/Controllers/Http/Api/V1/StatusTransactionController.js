'use strict'

const status = [
  {
    name: 'payExternal',
    displayName: 'Paga fora do sistema',
    status: 'galaxpay'
  },
  {
    name: 'cancel',
    displayName: 'Cancelada manualmente',
    status: 'galaxpay'
  },

  {
    name: 'captured',
    displayName: 'Capturada na Operadora',
    status: 'galaxpay'
  },
  {
    name: 'denied',
    displayName: 'Negada na Operadora',
    status: 'galaxpay'
  },
  {
    name: 'processError',
    displayName: 'Erro ao processar cobrança',
    status: 'galaxpay'
  },
  {
    name: 'reversed',
    displayName: 'Estornada na Operadora',
    status: 'galaxpay'
  },
  {
    name: 'notSend',
    displayName: 'Ainda não enviada para operadora',
    status: 'galaxpay'
  },
  {
    name: 'pendingBoleto',
    displayName: 'Em aberto',
    status: 'galaxpay'
  },
  {
    name: 'payedBoleto',
    displayName: 'Boleto pago',
    status: 'galaxpay'
  },
  {
    name: 'lessValueBoleto',
    displayName: 'Pago valor menor que o original',
    status: 'galaxpay'
  },
  {
    name: 'moreValueBoleto',
    displayName: 'Pago valor maior que o original',
    status: 'galaxpay'
  },
  {
    name: 'paidDuplicityBoleto',
    displayName: 'Pago em duplicidade',
    status: 'galaxpay'
  },
  {
    name: 'free',
    displayName: 'Isento',
    status: 'galaxpay'
  },
  {
    name: 'authorized',
    displayName: 'Autorizado',
    status: 'galaxpay'
  },
  {
    name: 'emAberto',
    displayName: 'Em aberto',
    status: 'koi'
  },
  {
    name: 'liquidado',
    displayName: 'Liquidado',
    status: 'koi'
  },
  {
    name: 'cancelado',
    displayName: 'Cancelado',
    status: 'koi'
  },
  {
    name: 'transmitir',
    displayName: 'Transmitir',
    status: 'galaxpay'
  }
]

class StatusTransactionController {
  getStatus ({ request, response }) {
    return status
  }
}

module.exports = StatusTransactionController
