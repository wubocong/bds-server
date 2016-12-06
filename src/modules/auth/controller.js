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
 * @apiDefine NotFound
 * @apiError Resource Not Found
 *
 * @apiErrorExample {json} Not Found:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "status": 404,
 *       "error": "NotFound"
 *     }
 */

/**
 * @apiDefine InternalServerError
 * @apiError The Backend Responded with an Error
 *
 * @apiErrorExample {json} InternalServer-Error:
 *     HTTP/1.1 404 InternalServerError
 *     {
 *       "status": 404,
 *       "error": "InternalServerError"
 *     }
 */

/**
 * @api {post} /auth Authenticate user
 * @apiVersion 0.3.0
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
            const data = await Student.findOne({studentId: user._id}, '-type -studentId')
            const {grade, major, clazz} = data.toJSON()
            await Promise.all([User.findById(data.teacherId, '-type -password -account -role'), Paper.findById(data.paperId, '-type -studentId -teacherId'), Defense.findById(data.defenseId, '-type -studentId -paperId')])
            .then(([teacher, paper, defense]) => {
              role = {grade, major, clazz, teacher, paper, defense}
              logger.info(role)
            })
            break
          }
        case 'teacher':
          {
            const data = await Teacher.findOne({teacherId: user._id}, '-type -teacherId')
            let defenses = []
            await Promise.all(data.defenseIds.map(async (defenseId) => {
              defenses.push(await Defense.findById(defenseId))
            }))
            role = {...data.toJSON(), defenses}

            logger.info(role)
            break
          }
        case 'admin':
          {
            const data = await Admin.findOne({adminId: user._id}, '-type -adminId')
            let defenses = []
            await Promise.all(data.defenseIds.map(async (defenseId) => {
              defenses.push(await Defense.findById(defenseId))
            }))
            role = {...data.toJSON(), defenses}

            logger.info(role)
            break
          }
        default: {
          throw (new Error('illegal request, may be attacked!'))
        }
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
      user: {...role, ...response},
      token,
    }
  })(ctx, next)
}
