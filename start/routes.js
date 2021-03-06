'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Helpers = use('Helpers')

/* const form = use('App/Views/form.html')

Route.get('/form', () => {
  return form
}) */

Route.group(() => {
  Route.get('/form', ({ view }) => {
    let nomes = [{ nome: 'Ivan' }, { nome: 'Carlos' }]
    console.log('entrei em form')
    // return view.render('home', { dados: nomes, sessao: null })
    Route.on('/').render('view.index')
  })

  // Pagseguro
  Route.post('/pagSeguro/session', 'PagSeguroController.session')
  Route.post('/pagSeguro/addPlano', 'PagSeguroController.addPlano')
  Route.post('/pagSeguro/addAdesao', 'PagSeguroController.addAdesao')
  Route.get('/pagSeguro/consultarPlanos', 'PagSeguroController.consultarPlanos')
  Route.post('/pagSeguro/notificacao', 'PagSeguroController.notificacao')
  Route.get(
    '/pagSeguro/listarOrdemsPagamento',
    'meioPagamentoController.pagSeguro.listarOrdemsPagamento'
  )

  Route.get(
    '/galaxPay/getCliente',
    'meioPagamentoController/galaxPay/GalaxPay.getCliente'
  )

  Route.get(
    '/galaxPay/getPessoaCartoes/:id',
    'meioPagamentoController/galaxPay/GalaxPay.getPessoaCartoes'
  )

  Route.get(
    '/galaxPay/getBandeiras',
    'meioPagamentoController/galaxPay/GalaxPay.getBandeiras'
  )

  Route.post(
    '/galaxPay/getCPF',
    'meioPagamentoController/galaxPay/GalaxPay.getCPF'
  )

  Route.post(
    '/pagarForaSistema',
    'meioPagamentoController/galaxPay/GalaxPay.pagarForaSistema'
  )

  Route.post(
    '/retryTransaction',
    'meioPagamentoController/galaxPay/GalaxPay.retryTransaction'
  )

  // PagarMe
  Route.post('/pagarMe/addPlano', 'pagarMeController/PagarMe.addPlano')

  Route.get('ps', 'LocalController.index')

  // Route.post('users', 'UserController.store')
  Route.post('sessions', 'SessionController.store').validator('Session')
  Route.post('validateToken', 'SessionController.validateToken')

  // Route.get('users', 'UserController.index').middleware(['auth'])

  Route.resource('/users', 'UserController')
    .apiOnly() // .except(['index']) nao incluir esta rota
    .validator(new Map([[['/users.store'], ['User']]]))
  // .except(['store'])
  // .middleware('auth')

  // Route.post('/users', 'UserController.store').validator('User')

  // Route.get('roles', 'RoleController.index').middleware(['auth:jwt'])
  // Route.put('roles/:id', 'RoleController.update')

  Route.resource('/roles', 'RoleController')
    .apiOnly()
    .middleware('auth')

  Route.get('permissions', 'PermissionController.index')
  Route.get('permissions/tree', 'PermissionController.tree')

  // Route.get('permissions/index2', 'PermissionController.index')
  Route.get('permissions/show', 'PermissionController.show')
  Route.put('permissions/user', 'PermissionController.user')
  Route.post('permissions', 'PermissionController.store')
  Route.put('permissions/:id', 'PermissionController.update')
  Route.delete('permissions/:id', 'PermissionController.destroy')

  Route.post('passwords', 'ForgotPasswordController.store').validator(
    'ForgotPassword'
  )

  Route.put('passwords', 'ForgotPasswordController.update').validator(
    'ResetPassword'
  )

  Route.get('ping', () => {
    return {
      message: 'pong'
    }
  })

  Route.get('oi', () => {
    return {
      message: 'oi'
    }
  }).middleware(['auth:jwt', 'can:delete_users'])

  Route.get('stats', () => {
    return {
      users: 123,
      categories: 23,
      articles: 30
    }
  }).middleware('auth')

  Route.get('listTokens', async ({ auth, response }) => {
    try {
      return await auth.check()
    } catch (error) {
      response.send('Missing or invalid api token')
    }
  })

  Route.get('check', async ({ auth, response }) => {
    try {
      return await auth.check()
    } catch (error) {
      response.send('You are not logged in')
    }
  })

  Route.get('getUser', async ({ auth, response }) => {
    try {
      return await auth.getUser()
    } catch (error) {
      response.send('You are not logged in')
    }
  })

  Route.get('logout', async ({ auth, response }) => {
    try {
      return await auth.logout()
    } catch (error) {
      response.send('falha no logout')
    }
  })

  Route.resource('/pessoas', 'PessoaController')
    .apiOnly()
    .validator(
      new Map([
        [['/pessoas.store'], ['pessoa/PessoaValidators']],
        [['/pessoas.store'], ['pessoa/EnderecoValidators']],
        [['/pessoas.update'], ['pessoa/PessoaUpdateValidators']],
        [['/pessoas.update'], ['pessoa/EnderecoValidators']]
      ])
    )

  Route.resource('/treinamentos', 'TreinamentoController')
    .apiOnly()
    .validator(
      new Map([
        [['/treinamentos.store'], ['TreinamentoValidators']],
        [['/treinamentos.update'], ['TreinamentoUpdateValidators']]
      ])
    )

  Route.resource('/locals', 'LocalController')
    .apiOnly()
    .validator(new Map([[['/locals.store'], ['LocalValidators']]]))

  Route.resource('/eventos', 'EventoController').apiOnly()
  Route.resource('/participantes', 'ParticipanteController').apiOnly()

  Route.resource('/tipoNegociacaos', 'TipoNegociacaoController').apiOnly()
  // .validator(new Map([[['/locals.store'], ['LocalValidators']]]))

  // .except(['store'])

  // Route.post('/pessoas', 'PessoaController.store').validator('pessoa/Add')

  //
  Route.post(
    '/email/dispararEmailInformativo',
    'EmailController.dispararEmailInformativo'
  )

  Route.post('/site', 'SiteController.addContrato')
  Route.put('/site', 'SiteController.updateContrato')
  Route.get('/site/getEventosSite', 'SiteController.getEventosSite')
  Route.get('/site/getBandeiras', 'SiteController.getBandeiras')
  Route.post('/site/getCPF', 'SiteController.getCPF')
  Route.post('/site/updateTransactions', 'SiteController.sicronizarTransacao')
  /* Route.post('/receber', 'ReceberController.store')
Route.put('/receber/:id', 'ReceberController.update')
Route.delete('/receber/:id', 'ReceberController.destroy')
Route.get('/receber/:id', 'ReceberController.show') */
  Route.resource('/receber', 'ReceberController').apiOnly()

  Route.resource('/receberItems', 'ReceberItemController').apiOnly()

  Route.resource('/contaReceber', 'ContaReceberController').apiOnly()

  Route.get('/getStatusTransaction', 'StatusTransactionController.getStatus')

  Route.resource('/prospeccao', 'ProspeccaoController').apiOnly()

  Route.post('/retorno', 'SiteController.retorno')

  Route.get(
    '/dashboard/getTodosTreinamentosAluno/:id',
    'Dashboard/AlunoController.getTodosTreinamentosAluno'
  )

  Route.post('maladireta/localizar', 'MaladiretaController.localizar')
  Route.post('maladireta/dispararEmail', 'MaladiretaController.dispararEmail')
  Route.post(
    'maladireta/disparoTeste',
    'MaladiretaController.dispararTesteEmail'
  )
  Route.post('maladireta/disparo', 'MaladiretaController.dispararEmail')
})
  .prefix('api/v1')
  .namespace('Api/V1')

// Route.any('*', ({ view }) => view.render('frontend'))

/* Route.any('*', ({ response }) =>
  response.download(Helpers.publicPath('index.html'))
) */

Route.on('/').render('welcome')

/* Route.any('*', function * (request, response) {
  yield response.sendView('index.html')
}) */
