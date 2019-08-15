'use strict'

// const Pessoa = use('App/Models/Pessoa')
const Participante = use('App/Models/Participante')

class AlunoController {
  async getTodosTreinamentosAluno ({ params, response }) {
    // const pessoa = await Pessoa.findOrFail(params.id)
    const participante = Participante.query()
    const ID = params.id
    console.log('id= ', ID)

    participante.where('pessoa_id', '=', ID)
    participante.with('pessoa')
    participante.with('evento')
    participante.with('evento.treinamento')
    participante.with('consultor')
    participante.with('padrinho')

    const o = await participante.fetch()
    const oJson = o.toJSON()

    let registros = []

    oJson.forEach(e => {
      let obj = {
        aluno: e.pessoa.nome,
        evento: e.evento.nome,
        treinamento: e.evento.treinamento.nome,
        dInicio: e.evento.dInicio,
        dTermino: e.evento.dTermino,
        consultor: e.consultor === null ? '' : e.consultor.nome,
        padrinho: e.padrinho === null ? '' : e.padrinho.nome,
        concluido: e.treinamentoConcluido === 1 ? 'SIM' : 'NÃO'
      }
      registros.push(obj)
    })

    response.status(200).send(registros)
  }
}

module.exports = AlunoController
