import passport from 'koa-passport'
import User from '../../models/users'
import Student from '../../models/students'
import Teacher from '../../models/teachers'
import Admin from '../../models/admins'
import Paper from '../../models/papers'
import Defense from '../../models/defenses'
const logger = require('koa-log4').getLogger('index')

/**
 * @apiDefine TokenError
 * @apiError Unauthorized Invalid JWT token
 *
 * @apiErrorExample {json} Unauthorized-Error:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "status": 401,
 *       "error": "Unauthorized"
 *     }
 */

/**
 * @api {post} /auth Authenticate user
 * @apiVersion 0.2.0
 * @apiName AuthUser
 * @apiGroup Auth
 *
 * @apiParam {String} account   User account.
 * @apiParam {String} password  User password.
 * @apiParam {String} role      User role.
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "account": "20090909", "password": "foo", "role": "teacher" }' localhost:5000/auth
 *
 * @apiSuccess {Object}   user           User object
 * @apiSuccess {ObjectId} user._id       User id
 * @apiSuccess {String}   user.name      User name
 * @apiSuccess {String}   user.account   User account
 * @apiSuccess {String}   user.role      User role
 * @apiSuccess {String}   token          Encoded JWT
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *         "_id": "56bd1da600a526986cf65c80"
 *         "account": "20090909"
 *         "name": "John Doe"
 *         "role": "teacher"
 *       }
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
 *     }
 *
 * @apiError Unauthorized Incorrect credentials
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "status": 401,
 *       "error": "Unauthorized"
 *     }
 */

export async function authUser (ctx, next) {
  return passport.authenticate('local', async (user) => {
    if (!user || (ctx.request.fields.role || 'student') !== user.role) {
      ctx.throw(401)
    }
    let role
    try {
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
            role = await Teacher.findOne({teacherId: user._id}, '-type').toJSON()
            logger.info(role)
            break
          }
        case 'admin':
          {
            role = await Admin.findOne({adminId: user._id}, '-type').toJSON()
            logger.info(role)
            break
          }
        default:
          break
      }
    } catch (err) {
      logger.error(err.message)
      ctx.throw(401, err.message)
    }
    logger.info(Object.keys(user))

    const token = user.generateToken()

    const response = user.toJSON()

    delete response.password
    ctx.body = {
      user: {...response, ...role},
      token,
    }
  })(ctx, next)
}
