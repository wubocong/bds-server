import passport from 'koa-passport'

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
 * @api {post} /auth/teacher Authenticate teacher
 * @apiVersion 1.0.0
 * @apiName AuthTeacher
 * @apiGroup Auth
 *
 * @apiParam {String} number  Teacher number.
 * @apiParam {String} password  Teacher password.
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "number": "20090909", "password": "foo" }' localhost:5000/auth/teacher
 *
 * @apiSuccess {Object}   teacher           Teacher object
 * @apiSuccess {ObjectId} teacher._id       Teacher id
 * @apiSuccess {String}   teacher.name      Teacher name
 * @apiSuccess {String}   teacher.number  Teacher number
 * @apiSuccess {String}   token          Encoded JWT
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "teacher": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "number": "20090909"
 *        },
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

export async function authTeacher (ctx, next) {
  return passport.authenticate('local', (teacher) => {
    if (!teacher) {
      ctx.throw(401)
    }

    const token = teacher.generateToken()

    const response = teacher.toJSON()

    delete response.password

    ctx.body = {
      token,
      teacher: response
    }
  })(ctx, next)
}

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
 * @api {post} /auth/admin Authenticate admin
 * @apiVersion 1.0.0
 * @apiName AuthAdmin
 * @apiGroup Auth
 *
 * @apiParam {String} number  Admin number.
 * @apiParam {String} password  Admin password.
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "number": "20080202", "password": "foo" }' localhost:5000/auth/admin
 *
 * @apiSuccess {Object}   admin           Admin object
 * @apiSuccess {ObjectId} admin._id       Admin id
 * @apiSuccess {String}   admin.name      Admin name
 * @apiSuccess {String}   admin.number  Admin number
 * @apiSuccess {String}   token          Encoded JWT
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "admin": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "number": "20080202"
 *        },
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

export async function authAdmin (ctx, next) {
  return passport.authenticate('local', (admin) => {
    if (!admin) {
      ctx.throw(401)
    }

    const token = admin.generateToken()

    const response = admin.toJSON()

    delete response.password

    ctx.body = {
      token,
      admin: response
    }
  })(ctx, next)
}

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
 * @api {post} /auth/student Authenticate student
 * @apiVersion 1.0.0
 * @apiName AuthStudent
 * @apiGroup Auth
 *
 * @apiParam {String} number  Student number.
 * @apiParam {String} password  Student password.
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "number": "201330330101", "password": "foo" }' localhost:5000/auth/student
 *
 * @apiSuccess {Object}   student           Student object
 * @apiSuccess {ObjectId} student._id       Student id
 * @apiSuccess {String}   student.name      Student name
 * @apiSuccess {String}   student.number  Student number
 * @apiSuccess {String}   token          Encoded JWT
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "student": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "number": "201330330101"
 *        },
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

export async function authStudent (ctx, next) {
  return passport.authenticate('local', (student) => {
    if (!student) {
      ctx.throw(401)
    }

    const token = student.generateToken()

    const response = student.toJSON()

    delete response.password

    ctx.body = {
      token,
      student: response
    }
  })(ctx, next)
}
