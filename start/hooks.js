const { hooks } = require('@adonisjs/ignitor')
const validarCpf = require('validar-cpf')

hooks.after.providersBooted(() => {
  const Validator = use('Validator')
  const Database = use('Database')

  const existsFn = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (!value) {
      return
    }

    const [table, column] = args
    const row = await Database.table(table)
      .where(column, value)
      .first()

    if (!row) {
      throw message
    }
  }

  const cpfFn = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (!value) {
      return
    }
    if (!validarCpf(value)) {
      // eslint-disable-next-line no-throw-literal
      throw 'CPF inválido.'
    }
  }

  const enderecoFn = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (value === null) {
      // eslint-disable-next-line no-throw-literal
      throw 'Não é permitido um endereço nulo.'
    }
    if (!value) {
    }
  }

  Validator.extend('exists', existsFn)
  Validator.extend('cpfValid', cpfFn)
  Validator.extend('enderecoValid', enderecoFn)
})
