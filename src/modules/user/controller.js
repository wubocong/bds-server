import User from '../../models/users'
import Student from '../../models/students'
import Teacher from '../../models/teachers'
import Admin from '../../models/admins'

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
    ctx.throw(422, err.message)
  }
  switch (user.role) {
    case 'student':
      {
        const student = new Student({
          ...user,
          studentId: user._id,
        })
        try {
          await student.save()
        } catch (err) {
          ctx.throw(500, err.message)
        }
        break
      }
    case 'teacher':
      {
        const teacher = new Teacher({
          ...user,
          teacherId: user._id,
        })
        try {
          await teacher.save()
        } catch (err) {
          ctx.throw(500, err.message)
        }
        break
      }
    case 'admin':
      {
        const admin = new Admin({
          ...user,
          adminId: user._id,
        })
        try {
          await admin.save()
        } catch (err) {
          ctx.throw(500, err.message)
        }
        break
      }
    default:
      break
  }
  const response = user.toJSON()

  delete response.password

  ctx.body = {
    user: response,
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
 * @apiSuccess {Object[]} users           Array of user objects
 * @apiSuccess {ObjectId} users._id       User id
 * @apiSuccess {String}   users.name      User name
 * @apiSuccess {String}   users.account   User account
 * @apiSuccess {String}   users.role      User role
 * @apiSuccess {Boolean}  user.gender    User gender
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "users": [{
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "account": "20080202"
 *          "role": "teacher"
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
          user = {...user, ...(await Student.find({studentId: id}, '-studentId'))}
          break
        }
      case 'teacher':
        {
          user = {...user, ...(await Teacher.find({teacherId: id}, '-teacherId'))}
          break
        }
      case 'admin':
        {
          user = {...user, ...(await Admin.find({adminId: id}, '-adminId'))}
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
 *       "success": true
 *     }
 *
 * @apiUse TokenError
 */

export async function deleteUser(ctx) {
  const user = ctx.body.user

  await user.remove()

  ctx.status = 200
  ctx.body = {
    success: true,
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
 *       "success": true
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
      user.set('password', ctx.request.fields.newPassword)
      await user.save()
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
  ctx.status = 200
  ctx.body = {
    success: true,
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
