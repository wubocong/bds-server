import User from '../../models/users'
import * as student from '../student/controller'
import * as admin from '../admin/controller'
import * as teacher from '../teacher/controller'

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
  let result
  try {
    await user.save()
  } catch (err) {
    ctx.throw(422, err.message)
  }
  switch (user.role) {
    case 'student':
      {
        result = await student.createStudent(user)
        break
      }
    case 'teacher':
      {
        result = await teacher.createTeacher(user._id)
        break
      }
    case 'admin':
      {
        result = await admin.createAdmin(user._id)
        break
      }
    default:
      break
  }
  if (!(result === true || !(result instanceof Error))) {
    ctx.throw(422, result.message)
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
    let user = await User.findById(id, '-password')
    switch (user.role) {
      case 'student':
        {
          user = {...user, ...(await student.getStudent(id))}
          break
        }
      case 'teacher':
        {
          user = {...user, ...(await teacher.getTeacher(id))}
          break
        }
      case 'admin':
        {
          user = {...user, ...(await student.getAdmin(id))}
          break
        }
      default:
        break
    }
    if (!user) {
      ctx.throw(404)
    }

    ctx.body = {
      user,
    }
  } catch (err) {
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
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "Cool new name"
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
 *
 * @apiUse TokenError
 */
export async function updateUser(ctx) {
  const user = ctx.body.user

  Object.assign(user, ctx.request.fields.user)

  await user.save()

  ctx.body = {
    user,
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

  await user.remove()

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
    if (user.role === ctx.request.fields.role && (await user.validatePassword(ctx.request.fields.oldPassword))) {
      user.password = ctx.request.fields.newPassword
      await user.save()
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
  ctx.status = 200
  ctx.body = {
    update: true,
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
