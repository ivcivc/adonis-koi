'use strict'

const Database = use('Database')

const User = use('App/Models/User')
const Permission = use('Adonis/Acl/Permission')

class PermissionController {
  async store ({ request }) {
    const data = request.only(['name', 'slug', 'description'])

    const permission = await Permission.create(data)
    return permission
  }

  async update ({ request, params }) {
    const data = request.only(['name', 'slug', 'description'])

    const permission = await Permission.findOrFail(params.id)

    permission.merge(data)

    await permission.save()

    return permission
  }

  async destroy ({ params }) {
    const permission = await Permission.findOrFail(params.id)
    console.log('destroindo.....')
    permission.delete()
  }

  async index () {
    const permissions = await Permission.all()
    return permissions
  }

  async tree () {
    const permissions = await Permission.query()
      .orderBy('class', 'order')
      .fetch()
    let o = {}
    let _class = null

    for (let i in permissions.rows) {
      const e = permissions.rows[i]
      if (_class !== e.class) {
        _class = e.class

        o[e.class] = {
          id: e.class,
          text: e.class,
          order: e.order,
          class: e.class,
          items: []
        }
      }
    }

    for (let i in permissions.rows) {
      const e = permissions.rows[i]
      e.text = e.name + ' - ' + e.description
      o[e.class].items.push(e)
    }
    let arr = []

    for (let i in o) {
      arr.push(o[i])
    }

    return arr
  }

  async show ({ auth }) {
    const user = await User.query()
      .where('id', auth.user.id)
      .first()

    return {
      roles: await user.getRoles(),
      permissions: await user.getPermissions()
    }
  }

  /*async user ({ request, response }) {
    let trx = null

    try {
      let { id, name, email } = request.body
      const role = request.body.role
      const permissions = request.body.permissions

      trx = await Database.beginTransaction()

      let user = await User.find(id)
      user.name = name
      user.email = email
      await user.save(trx)

      await user.roles().sync(role, trx)
      await user.permissions().sync(permissions, trx)

      await trx.commit()
      // let data = await User.find(1)
      // let roles = data.getRoles()
      // let perm = data.getPermissions()
      await user.loadMany(['roles', 'permissions'])
      return user
    } catch (error) {
      trx.rollback()
      return response.status(401).send('Falha de validação do token')
    }
  }*/
}

module.exports = PermissionController
