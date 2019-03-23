'use strict'

const User = use('App/Models/User')

class SessionController {
  async store ({ request, response, auth }) {
    try {
      const { email, password } = request.all()
      const token = await auth.attempt(email, password)

      const user = await User.findByOrFail('email', email)

      token.name = user.name
      token.email = user.email
      // token.roles = await user.getRoles()
      // token.admin = token.roles.includes('administrator')
      // token.permissions = await user.getPermissions()

      await user.loadMany(['roles', 'permissions'])

      user.token = token.token
      user.type = token.type
      user.refreshToken = token.refreshToken
      user.admin = false

      let getAdm = await user.getRoles()
      if (getAdm) {
        if (getAdm.length > 0) {
          if (getAdm.includes('administrator')) {
            user.admin = true
          }
        }
      }

      return user
    } catch (err) {
      return response
        .status(err.status)
        .send('Algo não deu certo, email ou senha incorreto.')
    }
  }

  // Validação de um token existente. Quando o usuario dar um refresh no navegador.
  async validateToken ({ request, response, auth }) {
    try {
      if (await auth.check()) {
        const { email } = request.all()
        await User.findByOrFail('email', email)

        return request.all()
      } else {
        return response.status(401).send('Falha de validação do token')
      }
    } catch (error) {
      response.status(401).send('Falha de validação do token')
    }
  }
}

module.exports = SessionController
