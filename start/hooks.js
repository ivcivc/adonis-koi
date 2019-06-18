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
    let endereco = {}
    endereco = value

    if (value === null) {
      endereco = {}
    } else {
      endereco = { endereco }
    }
    const Joi = require('@hapi/joi')
    const schema = Joi.object()
      .keys({
        endereco: {
          logradouro: Joi.string()
            .required()
            .error(new Error('o logradouro é obrigatório')),
          compl: Joi.string()
            .empty('')
            .error(new Error('O complemento não pode ser nulo')),
          bairro: Joi.string()
            .required()
            .error(new Error('O bairro é obrigatório')),
          cep: Joi.string()
            .required()
            .error(new Error('O cep obrigatório'))
            .min(8)
            .error(new Error('O cep deve ter pelo menos 8 dígitos.')),
          cidade: Joi.string()
            .required()
            .error(new Error('A cidade é obrigatória')),
          estado: Joi.string()
            .required()
            .error(new Error('Estado obrigatório (2 dígitos)'))
            .min(2)
            .max(2)
            .error(new Error('Estado deve ter 2 dígitos.'))
        }
      })
      .optionalKeys('endereco')

    const { error } = Joi.validate(endereco, schema)

    if (error) {
      throw error.message
    }

    if (!value) {
    }
  }

  Validator.extend('exists', existsFn)
  Validator.extend('cpfValid', cpfFn)
  Validator.extend('enderecoValid', enderecoFn)
})
