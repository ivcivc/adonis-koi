'use strict'

const Model = use('App/Models/Participante')

class Participante {
  async add (payload, trx) {
    try {
      const participante = await Model.create(payload, trx)
      return participante
    } catch (error) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'Não foi possível Adicionar um participante a um Evento.'
      }
    }
  }

  async get (ID, evento_id) {
    try {
      let data = await Model.findOrFail(ID)
      return data
    } catch (error) {
      throw error
    }
  }

  async destroy (ID) {
    try {
      const participante = await Model.find(ID)
      await participante.delete()
      return true
    } catch (error) {
      return error
    }
  }
}

module.exports = Participante
