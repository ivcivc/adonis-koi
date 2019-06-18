'use strict'

const Model = use('App/Models/Evento')
const Database = use('Database')

class Evento {
  async add (data) {}

  async update (ID, payload) {
    try {
      let evento = await Model.findOrFail(ID)
      evento.merge(payload)
      await evento.save()
      return evento
    } catch (e) {
      if (e.name === 'ModelNotFoundException') {
        // eslint-disable-next-line no-throw-literal
        throw { message: 'Evento não localizado!' }
      }

      if (e.name === 'TypeError') {
        // eslint-disable-next-line no-throw-literal
        throw { message: e.message }
      } else {
        switch (e.code) {
          case 'ER_DUP_ENTRY':
            // eslint-disable-next-line no-throw-literal
            throw { message: 'Duplicidade de registro detectada.' }
        }
      }
      throw e.message
    }
  }

  async get (ID) {
    try {
      let evento = await Model.findOrFail(ID)
      return evento
    } catch (error) {
      throw error
    }
  }
}

module.exports = Evento
