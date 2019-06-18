'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/
const User = use('App/Models/User')
const Role = use('Adonis/Acl/Role')
const Permission = use('Adonis/Acl/Permission')
const Grupo = use('App/Models/Grupo')

/** @type {import('@adonisjs/lucid/src/Factory')} */

class UserSeeder {
  async run () {
    const createUsersPermission = new Permission()
    createUsersPermission.slug = 'create_users'
    createUsersPermission.name = 'Create Users'
    createUsersPermission.description = 'create users permission'
    createUsersPermission.class = 'usuario'
    await createUsersPermission.save()

    const updateUsersPermission = new Permission()
    updateUsersPermission.slug = 'update_users'
    updateUsersPermission.name = 'Update Users'
    updateUsersPermission.description = 'update users permission'
    createUsersPermission.class = 'usuario'
    await updateUsersPermission.save()

    const deleteUsersPermission = new Permission()
    deleteUsersPermission.slug = 'delete_users'
    deleteUsersPermission.name = 'Delete Users'
    deleteUsersPermission.description = 'delete users permission'
    createUsersPermission.class = 'usuario'
    await deleteUsersPermission.save()

    const readUsersPermission = new Permission()
    readUsersPermission.slug = 'read_users'
    readUsersPermission.name = 'Read Users'
    readUsersPermission.description = 'read users permission'
    createUsersPermission.class = 'usuario'
    await readUsersPermission.save()

    const readDashboardPermission = new Permission()
    readDashboardPermission.slug = 'read_dashboard'
    readDashboardPermission.name = 'Read dashboard'
    readDashboardPermission.description = 'Ler o painel do Dashboard'
    readDashboardPermission.class = 'Dashboard'
    await readDashboardPermission.save()

    const roleAdmin = new Role()
    roleAdmin.name = 'Administrator'
    roleAdmin.slug = 'administrator'
    roleAdmin.description = 'manage administration privileges'
    await roleAdmin.save()

    await roleAdmin
      .permissions()
      .attach([
        createUsersPermission.id,
        updateUsersPermission.id,
        deleteUsersPermission.is,
        readUsersPermission.id
      ])

    const roleModerator = new Role()
    roleModerator.name = 'Moderator'
    roleModerator.slug = 'moderator'
    roleModerator.description = 'manage moderator privileges'
    await roleModerator.save()

    await roleModerator
      .permissions()
      .attach([createUsersPermission.id, readUsersPermission.id])

    const roleComum = new Role()
    roleComum.name = 'Comum'
    roleComum.slug = 'comum'
    roleComum.description = 'manage moderator comum privileges'
    await roleComum.save()

    await roleComum.permissions().attach([readUsersPermission.id])

    const user = await User.create({
      name: 'Ivan',
      email: 'ivan.a.oliveira@terra.com.br',
      password: '123456'
    })

    await user.roles().attach([roleAdmin.id, roleModerator.id])

    const userComum = await User.create({
      name: 'Usuario comum',
      email: 'usuario.comum@ivc.com.br',
      password: '123456'
    })

    await userComum.roles().attach([roleComum.id])

    const user1 = await User.find(1)
    // ['create_users', 'update_users', 'delete_users', 'read_users']
    console.log(await user1.getPermissions())

    const user2 = await User.find(2)
    // ['create_users', 'update_users', 'delete_users', 'read_users']
    console.log(await user2.getPermissions())

    const grupo1 = await new Grupo()
    grupo1.nome = 'ALUNO'
    await grupo1.save()

    const grupo2 = await new Grupo()
    grupo2.nome = 'CONSULTOR'
    await grupo2.save()

    const grupo3 = await new Grupo()
    grupo3.nome = 'FORNECEDOR'
    await grupo3.save()

    /*
    const permissaoAdm = await Permission.create({
      slug: 'permissao_adm',
      name: 'permitir tudo'
    })

    const permissaoUsuario = await Permission.create({
      slug: 'permissao_usuario',
      name: 'permitir usuario'
    })

    const admin = await Role.create({
      slug: 'administrator',
      name: 'Administrador'
    })

    const moderator = await Role.create({
      slug: 'moderator',
      name: 'Moderador'
    })

    await admin.permissions().attach([permissaoAdm.id, permissaoUsuario.id])
    await moderator.permissions().attach([permissaoUsuario.id])

    const user = await User.create({
      name_user: 'Usuario 1',
      email: 'usuario1@ivc.com.br',
      password: '123456'
    })

    user.Roles().attach([permissaoAdm.id])

    console.log(user) */
  }
}

module.exports = UserSeeder
