import User from '../../models/users'
import Student from '../../models/students'
import Teacher from '../../models/teachers'
import Admin from '../../models/admins'
import Paper from '../../models/papers'
import Defense from '../../models/defenses'
const logger = require('koa-log4').getLogger('index')

/**
 * @api {post} /users Create a new user
 * @apiPermission User
 * @apiVersion 0.2.0
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "user": { "account": "20080202", "password": "secretpasas", "role": "admin" } }' localhost:5000/users
 *
 * @apiParam {Object} user          User object (required)
 * @apiParam {String} user.account   User account.
 * @apiParam {String} user.password Password.
 *
 * @apiSuccess {Object}   user           User object
 * @apiSuccess {ObjectId} user._id       User id
 * @apiSuccess {String}   user.name      User name
 * @apiSuccess {String}   user.account   User account
 * @apiSuccess {String}   user.role      User role
 * @apiSuccess {Boolean}  user.gender    User gender
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "account": "20080202"
 *          "role": "teacher"
 *          "gender": true
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
 */
export async function createUser(ctx) {
  const user = new User(ctx.request.fields.user)
  try {
    await user.save()
  } catch (err) {
    logger.error(err.message)
    ctx.throw(422, err.message)
  }
  try {
    switch (user.role) {
      case 'student':
        {
          const student = new Student({studentId: user._id})
          await student.save()
          break
        }
      case 'teacher':
        {
          const teacher = new Teacher({teacherId: user._id})
          await teacher.save()
          break
        }
      case 'admin':
        {
          const admin = new Admin({adminId: user._id})
          await admin.save()
          break
        }
      default: {
        throw (new Error('illegal request, may be attacked!'))
      }
    }
  } catch (err) {
    logger.error(err.message)
    ctx.throw(422, err.message)
  }
  ctx.body = {
    create: true,
  }
}

/**
 * @api {get} /users Get all user
 * @apiPermission Admin
 * @apiVersion 0.2.0
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users
 *
 * @apiSuccess {StatusCode} 200
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "create": true
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
 * @apiVersion 0.2.0
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   user           User object
 * @apiSuccess {ObjectId} user._id       User id
 * @apiSuccess {String}   user.name      User name
 * @apiSuccess {String}   user.account    User account
 * @apiSuccess {String}   user.role      User role
 * @apiSuccess {Boolean}  user.gender    User gender
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
    let role
    switch (user.role) {
      case 'student':
        {
          const data = await Student.findOne({studentId: user._id}, '-type')
          const {grade, major, clazz} = data
          const teacher = await User.findById(data.teacherId)
          const paper = await Paper.findById(data.paperId, '-type -studentId -teacherId')
          const defense = await Defense.findById(data.defenseId, '-type -studentId -paperId')
          role = {grade, major, clazz, teacher, paper, defense}
          logger.info(role)
          break
        }
      case 'teacher':
        {
          role = (await Teacher.findOne({teacherId: user._id}, '-type')).toJSON()
          logger.info(role)
          break
        }
      case 'admin':
        {
          role = (await Admin.findOne({adminId: user._id}, '-type')).toJSON()
          logger.info(role)
          break
        }
      default: {
        throw (new Error(404))
      }
    }

    ctx.body = {
      user: {...user.toJSON(), ...role},
    }
  } catch (err) {
    logger.error(err.message)
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }

  if (next) {
    return next()
  }
}

/**
 * @api {put} /users/:id Update a user
 * @apiPermission Admin
 * @apiVersion 0.2.0
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "user": { "name": "Cool new Name", "role": "teacher" } }' localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiParam {Object}   user           User object (required)
 * @apiParam {String}   user.name      Name.
 * @apiParam {String}   user.account   User account.
 * @apiParam {String}   user.role      User role.
 * @apiParam {Boolean}  user.gender    User gender.
 *
 * @apiSuccess {Object}   user           User object
 * @apiSuccess {ObjectId} user._id       User id
 * @apiSuccess {String}   user.name      Updated name
 * @apiSuccess {String}   user.account    Updated account
 * @apiSuccess {String}   user.role      Updated role
 * @apiSuccess {Boolean}  user.gender    User gender
 *
 * @apiSuccess {StatusCode} 200
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
  delete ctx.request.fields.user.password
  Object.assign(user, ctx.request.fields.user)
  try {
    switch (user.role) {
      case 'student': {
        await Student.findOneAndUpdate({studentId: user._id}, {$set: {teacherId: ctx.request.fields.teacherId, paperId: ctx.request.fields.paperId, defenseId: ctx.request.fields.defenseId}}, {safe: true, upsert: true})
        break
      }
      case 'teacher': {
        await Teacher.findOneAndUpdate({teacherId: user._id}, {$concatArrays: ['studentIds', ctx.request.fields.studentIds]}, {safe: true, upsert: true})
        break
      }
      case 'admin': {
        await Admin.findOneAndUpdate({adminId: user._id}, {$concatArrays: ['defenseIds', ctx.request.fields.defenseIds]}, {safe: true, upsert: true})
        break
      }
      default: {
        throw (new Error('illegal request, may be attacked!'))
      }
    }
    await user.save()
  } catch (err) {
    logger.error(err.message)
    ctx.throw(401, err.message)
  }
  ctx.body = {
    update: true,
  }
}

/**
 * @api {delete} /users/:id Delete a user
 * @apiPermission Admin
 * @apiVersion 0.2.0
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X DELETE localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiSuccess {StatusCode} 200
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
    logger.error(err.message)
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
 * @apiVersion 0.2.0
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
 * @apiSuccess {StatusCode} 200
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "update": true
 *     }
 *
 * @apiError Unauthorized Incorrect credentials
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
    logger.error(err.message)
    ctx.throw(401, err.message)
  }
}

/**
 * @api {get} /users/me Get personal user
 * @apiPermission User personally
 * @apiVersion 0.2.0
 * @apiName GetMe
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users/me
 *
 * @apiSuccess {Object}   user           User object
 * @apiSuccess {ObjectId} user._id       User id
 * @apiSuccess {String}   user.name      User name
 * @apiSuccess {String}   user.account   User account
 * @apiSuccess {String}   user.role      User role
 * @apiSuccess {Boolean}  user.gender    User gender
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
