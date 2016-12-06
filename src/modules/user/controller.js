import User from '../../models/users'
import Student from '../../models/students'
import Teacher from '../../models/teachers'
import Admin from '../../models/admins'
import Paper from '../../models/papers'
import Defense from '../../models/defenses'
const logger = require('koa-log4').getLogger('index')

/**
 * @api {post} /users Create a new user
 * @apiPermission SuperAdmin
 * @apiVersion 0.3.0
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "user": { "name": "phy", "account": "20080202",  "role": "admin" } }' localhost:5000/users
 *
 * @apiParam {Object} user              User object (required)
 * @apiParam {String} user.name         User name (required)
 * @apiParam {String} user.account      User account (required)
 * @apiParam {String} user.role         User role (required)
 * @apiParam {String} user.password     Password
 * @apiParam {String} user.gender       User gender
 * @apiParam {String} user.university   User university
 * @apiParam {String} user.school       User school
 * @apiParam {String} user.email        User email
 * @apiParam {String} user.phone        User phone
 * @apiParam {String} user.avatar       User avatar
 *
 * @apiSuccess {Object}   user           User object
 * @apiSuccess {ObjectId} user._id       User id
 * @apiSuccess {String}   user.role      User role
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "role": "student"
 *       }
 *     }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 *
 * @apiUse TokenError
 */

export async function createUser(ctx) {
  delete ctx.request.fields.user.type
  ctx.request.fields.user.password = ctx.request.fields.user.password || ctx.request.fields.user.account
  const user = new User(ctx.request.fields.user)
  let role
  try {
    await user.save()
    switch (user.role) {
      case 'student':
        {
          role = new Student({...ctx.request.fields.user, studentId: user._id})
          await role.save()
          break
        }
      case 'teacher':
        {
          role = new Teacher({...ctx.request.fields.user, teacherId: user._id})
          await role.save()
          break
        }
      case 'admin':
        {
          role = new Admin({...ctx.request.fields.user, adminId: user._id})
          await role.save()
          break
        }
      default: {
        throw (new Error('illegal request, may be attacked!'))
      }
    }

    ctx.body = {
      user: { _id: user._id, role: user.role },
    }
  } catch (err) {
    logger.error(ctx.url + ' ' err.message)
    ctx.throw(422, err.message)
    await Promise.all([user.remove && user.remove(), role.remove && role.remove()])
  }
}

/**
 * @api {get} /users Get all user
 * @apiPermission Admin
 * @apiVersion 0.3.0
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users
 *
 * @apiSuccess {Object[]} users              User objects
 * @apiSuccess {ObjectId} users._id          User id
 * @apiSuccess {String}   users.name         User name
 * @apiSuccess {String}   users.account      User account
 * @apiSuccess {String}   users.role         User role
 * @apiSuccess {String}   users.gender       User gender
 * @apiSuccess {String}   users.university   User university
 * @apiSuccess {String}   users.school       User school
 * @apiSuccess {String}   users.email        User email
 * @apiSuccess {String}   users.phone        User phone
 * @apiSuccess {String}   users.avatar       User avatar
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "users": [{
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "account": "20080202"
 *          "role": "admin"
 *          "gender": true
 *       }]
 *     }
 *
 * @apiUse TokenError
 */

export async function getUsers(ctx) {
  const users = await User.find({}, '-password')
  ctx.body = {
    users,
  }
}

/**
 * @api {get} /users/:id Get user by id
 * @apiPermission Admin
 * @apiVersion 0.3.0
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   user              User object
 * @apiSuccess {ObjectId} user._id          User id
 * @apiSuccess {String}   user.name         User name
 * @apiSuccess {String}   user.account      User account
 * @apiSuccess {String}   user.role         User role
 * @apiSuccess {String}   user.gender       User gender
 * @apiSuccess {String}   user.university   User university
 * @apiSuccess {String}   user.school       User school
 * @apiSuccess {String}   user.email        User email
 * @apiSuccess {String}   user.phone        User phone
 * @apiSuccess {String}   user.avatar       User avatar
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "account": "20080202"
 *          "role": "admin"
 *          "gender": true
 *       }
 *     }
 *
 * @apiUse TokenError
 */

export async function getUser(ctx, next) {
  const id = ctx.params.id
  try {
    const user = await User.findById(id, '-password')
    if (next) {
      ctx.body = {
        user,
      }
      return next()
    }
    ctx.body = {
      user: {...user.toJSON()},
    }
  } catch (err) {
    logger.error(ctx.url + ' ' err.message)
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }
}

/**
 * @api {get} /users/role/:id Get role by user id
 * @apiPermission Admin
 * @apiVersion 0.3.0
 * @apiName GetRole
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users/role/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   user              User object
 * @apiSuccess {ObjectId} user._id          User id
 * @apiSuccess {String}   user.name         User name
 * @apiSuccess {String}   user.account      User account
 * @apiSuccess {String}   user.role         User role
 * @apiSuccess {String}   user.gender       User gender
 * @apiSuccess {String}   user.university   User university
 * @apiSuccess {String}   user.school       User school
 * @apiSuccess {String}   user.email        User email
 * @apiSuccess {String}   user.phone        User phone
 * @apiSuccess {String}   user.avatar       User avatar
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "account": "20080202"
 *          "role": "admin"
 *          "gender": true
 *       }
 *     }
 *
 * @apiUse TokenError
 */

export async function getRole(ctx, next) {
  let role
  const user = ctx.body.user
  try {
    switch (user.role) {
      case 'student':
        {
          const data = (await Student.findOne({studentId: user._id}, '-type -studentId')).toJSON()
          const {grade, major, clazz} = data
          await Promise.all([User.findById(data.teacherId, '-type -password -account -role'), Paper.findById(data.paperId, '-type -studentId -teacherId'), Defense.findById(data.defenseId, '-type -studentId -paperId')])
            .then(([teacher, paper, defense]) => {
              role = {grade, major, clazz, teacher, paper, defense}
              logger.info(role)
            })
          break
        }
      case 'teacher':
        {
          const data = (await Teacher.findOne({teacherId: user._id}, '-type -teacherId')).toJSON()
          let defenses = []
          let papers = []
          let students = []
          data.defenseIds = data.defenseIds || []
          data.paperIds = data.paperIds || []
          data.studentIds = data.studentIds || []
          await Promise.all([...data.defenseIds.map(async (defenseId) => {
            defenses.push(await Defense.findById(defenseId))
          }), ...data.paperIds.map(async (paperId) => {
            papers.push(await Paper.findById(paperId))
          }), ...data.studentIds.map(async (studentId) => {
            students.push(await User.findById(studentId, '-password'))
          })])
          delete data.defenseIds
          delete data.paperIds
          delete data.studentIds
          role = { ...data, defenses, papers, students }

          logger.info(role)
          break
        }
      case 'admin':
        {
          const data = (await Admin.findOne({teacherId: user._id}, '-type -adminId')).toJSON()
          let defenses = []
          await Promise.all(data.defenseIds.map(async (defenseId) => {
            defenses.push(await Defense.findById(defenseId))
          }))
          delete data.defenseIds
          role = {...data, defenses}

          logger.info(role)
          break
        }
      default: {
        throw (new Error('illegal request, may be attacked!'))
      }
    }
    if (next) {
      ctx.body = {
        user,
        role,
      }
      return next()
    }
    const response = user.toJSON()
    delete response.password
    ctx.body = {
      user: {...response, ...role, token: ctx.body.token},
    }
  } catch (err) {
    logger.error(ctx.url + ' ' err.message)
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
}

/**
 * @api {put} /users/:id Update a user
 * @apiPermission User
 * @apiVersion 0.3.0
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "user": { "name": "Cool new Name", "role": "teacher" } }' localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiParam {Object} user              User object (required)
 * @apiParam {String} user.name         User name
 * @apiParam {String} user.gender       User gender
 * @apiParam {String} user.university   User university
 * @apiParam {String} user.school       User school
 * @apiParam {String} user.email        User email
 * @apiParam {String} user.phone        User phone
 * @apiParam {String} user.avatar       User avatar
 *
 * @apiSuccess {Boolean}   update     Action status
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "update": true
 *     }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 *
 * @apiUse TokenError
 */

export async function updateUser(ctx) {
  const user = ctx.body.user

  if (!ctx.request.fields.user) {
    ctx.throw(422)
  }
  try {
    switch (user.role) {
      case 'student': {
        await Student.findOneAndUpdate({studentId: user._id}, {$set: {teacherId: ctx.request.fields.teacherId, paperId: ctx.request.fields.paperId, defenseId: ctx.request.fields.defenseId}}, {safe: true, upsert: true})
        break
      }
      case 'teacher': {
        if (ctx.request.fields.user.studentIds) {
          await Teacher.findOneAndUpdate({teacherId: user._id}, {$pushAll: {studentIds: ctx.request.fields.user.studentIds}})
        }
        break
      }
      case 'admin': {
        if (ctx.request.fields.user.studentIds) {
          await Admin.findOneAndUpdate({adminId: user._id}, {$pushAll: {defenseIds: ctx.request.fields.user.defenseIds}})
        }
        break
      }
      default: {
        throw (new Error('illegal request, may be attacked!'))
      }
    }
    logger.info(user)
    delete ctx.request.fields.user.account
    delete ctx.request.fields.user.password
    delete ctx.request.fields.user.type
    delete ctx.request.fields.user.role
    Object.assign(user, ctx.request.fields.user)
    await user.save()
  } catch (err) {
    logger.error(ctx.url + ' ' err.message)
    ctx.throw(401, err.message)
  }
  ctx.body = {
    update: true,
  }
}

/**
 * @api {delete} /users/:id Delete a user
 * @apiPermission SuperAdmin
 * @apiVersion 0.3.0
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X DELETE localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Boolean}   delete     Action status
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "delete": true
 *     }
 *
 * @apiUse TokenError
 */

export async function deleteUser(ctx) {
  const user = ctx.body.user

  try {
    switch (user.role) {
      case 'student': {
        await Student.findOneAndRemove({studentId: user._id})
        break
      }
      case 'teacher': {
        await Teacher.findOneAndRemove({teacherId: user._id})
        break
      }
      case 'admin': {
        await Admin.findOneAndRemove({adminId: user._id})
        break
      }
      default: {
        throw (new Error('illegal request, may be attacked!'))
      }
    }
    await user.remove()
  } catch (err) {
    logger.error(ctx.url + ' ' err.message)
    ctx.throw(401, err.message)
  }
  ctx.status = 200
  ctx.body = {
    delete: true,
  }
}

/**
 * @api {put} /users/password/:id Modify a user's password
 * @apiPermission Admin
 * @apiVersion 0.3.0
 * @apiName ModifyPassword
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d ' { "oldPassword": "fuck", "newPassword": "fuckyou", "role": "teacher" }' localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiParam {String} oldPassword   User old password.
 * @apiParam {String} newPassword   User new password.
 * @apiParam {String} role          User role.
 *
 * @apiSuccess {Boolean}   update     Action status
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "update": true
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 *
 * @apiUse TokenError
 */

export async function modifyPassword(ctx) {
  try {
    const user = await User.findById(ctx.params.id)
    logger.info(ctx.request.fields)
    if (user.role === ctx.request.fields.role && ctx.params.id === user._id.toString() && (await user.validatePassword(ctx.request.fields.oldPassword))) {
      user.password = ctx.request.fields.newPassword
      await user.save()

      ctx.status = 200
      ctx.body = {
        update: true,
      }
    } else {
      throw (new Error('illegal request, may be attacked!'))
    }
  } catch (err) {
    logger.error(ctx.url + ' ' err.message)
    ctx.throw(401, err.message)
  }
}

/**
 * @api {get} /users/me Get personal user
 * @apiPermission User personally
 * @apiVersion 0.3.0
 * @apiName GetMe
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users/me
 *
 * @apiSuccess {Object}   user              User object
 * @apiSuccess {ObjectId} user._id          User id
 * @apiSuccess {String}   user.name         User name
 * @apiSuccess {String}   user.account      User account
 * @apiSuccess {String}   user.role         User role
 * @apiSuccess {String}   user.gender       User gender
 * @apiSuccess {String}   user.university   User university
 * @apiSuccess {String}   user.school       User school
 * @apiSuccess {String}   user.email        User email
 * @apiSuccess {String}   user.phone        User phone
 * @apiSuccess {String}   user.avatar       User avatar
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "account": "20080202"
 *          "role": "admin"
 *          "gender": true
 *       }
 *     }
 *
 * @apiUse TokenError
 */

export async function getMe(ctx) {
  if (!ctx.state.user) {
    ctx.throw(401)
  }
  ctx.status = 200
  ctx.body = {
    user: ctx.state.user,
  }
}

/**
 * @api {get} /users/contactAdmin Get admin's email and phone number
 * @apiPermission All
 * @apiVersion 0.3.0
 * @apiName ContactAdmin
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users/contactAdmin
 *
 * @apiSuccess {Object}   user           User object
 * @apiSuccess {Number}   user.phone     User phone number
 * @apiSuccess {String}   user.email     User email
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "account": "20080202"
 *          "role": "admin"
 *          "gender": true
 *       }
 *     }
 *
 * @apiUse NotFound
 *
 * @apiUse InternalServerError
 */
export async function contactAdmin(ctx, next) {
  try {
    const user = await User.findOne({ role: 'admin', school: ctx.request.fields.school, university: ctx.request.fields.university }, 'email phone')
    ctx.body = {
      user: user.toJSON(),
    }
  } catch (err) {
    logger.error(ctx.url + ' ' err.message)
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404, 'Not Found')
    }
    ctx.throw(500, 'Internal Server Error')
  }
}

/**
 * @api {post} /users/admin Create a new user
 * @apiPermission User
 * @apiVersion 0.3.0
 * @apiName CreateAdmin
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "user": { "name": "phy", "account": "20080202", "password": "phy" } }' localhost:5000/users
 *
 * @apiParam {Object} user              User object (required)
 * @apiParam {String} user.name         User name (required)
 * @apiParam {String} user.account      User account (required)
 * @apiParam {String} user.password     Password (required)
 * @apiParam {String} user.gender       User gender
 * @apiParam {String} user.university   User university
 * @apiParam {String} user.school       User school
 * @apiParam {String} user.email        User email
 * @apiParam {String} user.phone        User phone
 * @apiParam {String} user.avatar       User avatar
 *
 * @apiSuccess {Object}   user           User object
 * @apiSuccess {ObjectId} user._id       User id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *       }
 *     }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 *
 * @apiUse TokenError
 */

export async function createAdmin(ctx) {
  delete ctx.request.fields.user.type
  ctx.request.fields.user.role = 'admin'
  if (!ctx.request.fields.user.password) {
    ctx.throw(422, 'Unprocessable Entity')
  }
  const user = new User(ctx.request.fields.user)
  let admin
  try {
    await user.save()
    admin = new Admin({...ctx.request.fields.user, adminId: user._id})
    await admin.save()

    ctx.body = {
      user: { _id: user._id, role: user.role },
    }
  } catch (err) {
    logger.error(ctx.url + ' ' err.message)
    ctx.throw(422, err.message)
    await Promise.all([user.remove && user.remove(), admin.remove && admin.remove()])
  }
}

/**
 * @api {post} /users/teachers Create teachers
 * @apiPermission Admin
 * @apiVersion 0.3.0
 * @apiName CreateTeachers
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "users": [{ "name": "phy", "account": "20080202" }] }' localhost:5000/users/teachers
 *
 * @apiParam {Object} user              User object (required)
 * @apiParam {String} user.name         User name (required)
 * @apiParam {String} user.account      User account (required)
 * @apiParam {String} user.password     Password
 * @apiParam {String} user.gender       User gender
 * @apiParam {String} user.university   User university
 * @apiParam {String} user.school       User school
 * @apiParam {String} user.email        User email
 * @apiParam {String} user.phone        User phone
 * @apiParam {String} user.avatar       User avatar
 *
 * @apiSuccess {ObjectId[]}   userIds       User ids
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "userIds": ["56bd1da600a526986cf65c80"]
 *     }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 *
 * @apiUse TokenError
 */

export async function createTeachers(ctx) {
  const userIds = []
  await Promise.all(ctx.request.fields.users.map(async(user) => {
    delete user.type
    user.role = 'teacher'
    user.password = user.password || user.account
    const newUser = new User(user)
    let role
    try {
      await newUser.save()
      role = new Teacher({...user, teacherId: newUser._id})
      await role.save()

      userIds.push(newUser._id)
    } catch (err) {
      logger.error(ctx.url + ' ' err.message)
      ctx.throw(422, err.message)
      await Promise.all([newUser.remove && newUser.remove(), role.remove && role.remove()])
    }
  }))
  ctx.body = {
    userIds,
  }
}

/**
 * @api {post} /users/students Create students
 * @apiPermission Admin
 * @apiVersion 0.3.0
 * @apiName CreateStudents
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "users": [{ "name": "phy", "account": "20080202" }] }' localhost:5000/users/students
 *
 * @apiParam {Object} users              User objects (required)
 * @apiParam {String} users.name         User name (required)
 * @apiParam {String} users.account      User account (required)
 * @apiParam {String} users.password     Password
 * @apiParam {String} users.gender       User gender
 * @apiParam {String} users.university   User university
 * @apiParam {String} users.school       User school
 * @apiParam {String} users.email        User email
 * @apiParam {String} users.phone        User phone
 * @apiParam {String} users.avatar       User avatar
 *
 * @apiSuccess {ObjectId[]}   userIds       User ids
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "userIds": ["56bd1da600a526986cf65c80"]
 *     }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 *
 * @apiUse TokenError
 */

export async function createStudents(ctx) {
  const userIds = []
  await Promise.all(ctx.request.fields.users.map(async(user) => {
    delete user.type
    user.role = 'student'
    user.password = user.password || user.account
    const newUser = new User(user)
    let role
    try {
      await newUser.save()
      role = new Student({...user, studentId: newUser._id, teacherId: (await User.find({account: user.teacherAccount}))._id})
      await Promise.all([await role.save(), Teacher.findOneAndUpdate({teacherId: role.teacherId}, {$addToSet: {studentIds: newUser._id}})])
      userIds.push(newUser._id)
    } catch (err) {
      logger.error(ctx.url + ' ' err.message)
      ctx.throw(422, err.message)
      await Promise.all([newUser.remove && newUser.remove(), role.remove && role.remove()])
    }
  }))
  ctx.body = {
    userIds,
  }
}
