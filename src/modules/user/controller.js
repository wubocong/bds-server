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
 * @apiVersion 0.4.0
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
    logger.error(ctx.url + ' ' + err.message)
    ctx.throw(422, err.message)
    await Promise.all([user.remove && user.remove(), role.remove && role.remove()])
  }
}

/**
 * @api {get} /users Get all user
 * @apiPermission Admin
 * @apiVersion 0.4.0
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
 * @apiVersion 0.4.0
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
    logger.error(ctx.url + ' ' + err.message)
    if (err.message === '404' || err.name === 'CastError') {
      ctx.throw(404, 'Not Found')
    }

    ctx.throw(500, err.message)
  }
}

/**
 * @api {get} /users/role/:id Get role by user id
 * @apiPermission Admin
 * @apiVersion 0.4.0
 * @apiName GetRole
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users/role/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}       user              User object
 * @apiSuccess {ObjectId}     user._id          User id
 * @apiSuccess {String}       user.name         User name
 * @apiSuccess {String}       user.account      User account
 * @apiSuccess {String}       user.gender       User gender
 * @apiSuccess {String}       user.university   User university
 * @apiSuccess {String}       user.school       User school
 * @apiSuccess {String}       user.email        User email
 * @apiSuccess {String}       user.phone        User phone
 * @apiSuccess {String}       user.avatar       User avatar
 * @apiSuccess {String}       user.role         User role
 * @apiSuccess {String}       user.type         User type
 * @apiSuccess {String}       user.proTitle     Teacher's proTitle
 * @apiSuccess {String}       user.posTitle     Teacher's posTitle
 * @apiSuccess {Object[]}     user.defenses     Teacher's defenses
 * @apiSuccess {String}       user.grade        Student's phone
 * @apiSuccess {String}       user.major        Student's avatar
 * @apiSuccess {String}       user.clazz        Student's avatar
 * @apiSuccess {Object}       user.paper        Student's paper
 * @apiSuccess {Object}       user.teacher      Student's teacher
 * @apiSuccess {Object}       user.defense      Student's defense
 * @apiSuccess {String}       user.defenses     Admin's defenses
 * @apiSuccess {String}       token             Token
 *
 * @apiSuccessExample {json} Teacher-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *         "_id": "5846d894354af33c8061f2d6",
 *         "name": "ls1",
 *         "account": "ls1",
 *         "phone": "18813752121",
 *         "email": "wubocong1@163.com",
 *         "school": "软件学院",
 *         "university": "华南农业大学",
 *         "gender": true,
 *         "role": "teacher",
 *         "type": "User",
 *         "proTitle": "",
 *         "posTitle": "无",
 *         "defenses": [
 *           {
 *             "_id": "5846d84d354af33c8061f2d4",
 *             "name": "ing",
 *             "address": "honor palace",
 *             "time": "1970-01-13T23:43:42.222Z",
 *             "adminId": "5846d709fd28fc46dc18798c",
 *             "leaderId": "5846d894354af33c8061f2d5",
 *             "paperIds": [
 *               "5846d824354af33c8061f2c7",
 *               "5846d754e04a610eb81625bb",
 *               "5846d82a354af33c8061f2cf"
 *             ],
 *             "teacherIds": [
 *               "5846d8a4354af33c8061f2d8",
 *               "5846d894354af33c8061f2d5",
 *               "5846d707fd28fc46dc18798e"
 *             ],
 *             "studentIds": [
 *               "5846d8c4354af33c8061f2dd",
 *               "5846d8b6354af33c8061f2da",
 *               "5846d709fd28fc46dc187990"
 *             ],
 *             "finished": 2,
 *             "status": 1
 *           }
 *         ],
 *         "papers": [
 *           {
 *             "_id": "5846d754e04a610eb81625bb",
 *             "studentId": "5846d709fd28fc46dc1879da",
 *             "teacherId": "5846d707fd28fc46dc1879d5",
 *             "defenseId": "5846d84d354af33c8061f2d4",
 *             "name": "战斗怒火",
 *             "file": {
 *               "name": "pdsig",
 *               "path": "ussuu",
 *               "_id": "5846d754e04a610eb81625bd",
 *               "lastModified": "2016-12-06T15:20:52.498Z"
 *             },
 *             "lastModified": "2016-12-06T15:20:52.495Z",
 *             "remark": "FUCKFUCKFUCK",
 *             "finalScore": 100,
 *             "comments": [
 *               {
 *                 "content": "哈哈哈",
 *                 "_id": "5846d754e04a610eb81625bc",
 *                 "id": 0,
 *                 "time": "2016-12-06T15:20:52.496Z"
 *               },
 *               {
 *                 "content": "嘿嘿嘿",
 *                 "_id": "5846d754e04a610eb81625bf",
 *                 "id": 1,
 *                 "time": "2016-12-06T15:20:52.496Z"
 *               },
 *               {
 *                 "content": "吼吼吼",
 *                 "_id": "5846d754e04a610eb81625be",
 *                 "id": 2,
 *                 "time": "2016-12-06T15:20:52.496Z"
 *               }
 *             ],
 *             "scores": [
 *               {
 *                 "_id": "58481db6756a0c1c3070bde3",
 *                 "isLeader": false,
 *                 "sum": 80,
 *                 "teacher": {
 *                   "_id": "5846d707fd28fc46dc18798e",
 *                   "name": "ls"
 *                 },
 *                 "items": {
 *                   "defenseScore": 4,
 *                   "innovationScore": 4,
 *                   "descriptionScore": 4,
 *                   "resultScore": 4,
 *                   "qualityScore": 4,
 *                   "designScore": 4,
 *                   "pointScore": 4,
 *                   "topicScore": 4
 *                 }
 *               },
 *               {
 *                 "_id": "584827c69bc8cc5328709f1a",
 *                 "isLeader": true,
 *                 "sum": 80,
 *                 "teacher": {
 *                   "_id": "5846d894354af33c8061f2d5",
 *                   "name": "ls1"
 *                 },
 *                 "items": {
 *                   "defenseScore": 4,
 *                   "innovationScore": 4,
 *                   "descriptionScore": 4,
 *                   "resultScore": 4,
 *                   "qualityScore": 4,
 *                   "designScore": 4,
 *                   "pointScore": 4,
 *                   "topicScore": 4
 *                 }
 *               },
 *               {
 *                 "_id": "584827f59bc8cc5328709f20",
 *                 "isLeader": false,
 *                 "sum": 80,
 *                 "teacher": {
 *                   "_id": "5846d8a4354af33c8061f2d8",
 *                   "name": "ls2"
 *                 },
 *                 "items": {
 *                   "defenseScore": 4,
 *                   "innovationScore": 4,
 *                   "descriptionScore": 4,
 *                   "resultScore": 4,
 *                   "qualityScore": 4,
 *                   "designScore": 4,
 *                   "pointScore": 4,
 *                   "topicScore": 4
 *                 }
 *               }
 *             ],
 *             "desp": "fuckfuckfuck",
 *             "type": "Paper"
 *           }
 *         ],
 *         "students": [{
 *           "_id": "5846d709fd28fc46dc187990",
 *           "name": "phy",
 *           "account": "phy",
 *           "phone": "18813752125",
 *           "email": "wubocong123@163.com",
 *           "school": "软件学院",
 *           "university": "华南农业大学",
 *           "gender": true,
 *           "role": "student",
 *           "type": "User"
 *         }]
 *       },
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4NDZkODk0MzU0YWYzM2M4MDYxZjJkNSIsImlhdCI6MTQ4MTI3OTc4MSwiZXhwIjoxNDgxMzE1NzgxfQ.CYLOBb6cshZghZM566Q35G1IoCFfsc1JNRGJVfUsME4"
 *     }
 *
 * @apiSuccessExample {json} Student-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *         "_id": "5846d709fd28fc46dc187990",
 *         "name": "phy",
 *         "account": "phy",
 *         "phone": "18813752125",
 *         "email": "wubocong123@163.com",
 *         "school": "软件学院",
 *         "university": "华南农业大学",
 *         "gender": true,
 *         "role": "student",
 *         "type": "User",
 *         "grade": 2013,
 *         "major": "软件工程",
 *         "clazz": "R5",
 *         "teacher": {
 *           "_id": "5846d707fd28fc46dc18798e",
 *           "name": "ls",
 *           "phone": "18813752174",
 *           "email": "wubocong1@163.com",
 *           "school": "软件学院",
 *           "university": "华南农业大学",
 *           "gender": true
 *         },
 *         "paper": {
 *           "_id": "5846d82a354af33c8061f2cf",
 *           "defenseId": "5846d84d354af33c8061f2d4",
 *           "name": "治疗之环",
 *           "file": {
 *             "name": "pdsig",
 *             "path": "ussuu",
 *             "_id": "5846d82a354af33c8061f2d1",
 *             "lastModified": "2016-12-06T15:24:26.501Z"
 *           },
 *           "lastModified": "2016-12-06T15:24:26.500Z",
 *           "remark": "他是猪",
 *           "finalScore": 0,
 *           "comments": [],
 *           "scores": [
 *             {
 *               "_id": "5846d82a354af33c8061f2d2",
 *               "isLeader": false,
 *               "sum": 0,
 *               "items": {
 *                 "score": 0,
 *                 "defenseScore": 0,
 *                 "innovationScore": 0,
 *                 "descriptionScore": 0,
 *                 "resultScore": 0,
 *                 "qualityScore": 0,
 *                 "designScore": 0,
 *                 "pointScore": 0,
 *                 "topicScore": 0
 *               }
 *             }
 *           ],
 *           "desp": "fuckfuckfuck"
 *         },
 *         "defense": {
 *           "_id": "5846d84d354af33c8061f2d4",
 *           "name": "ing",
 *           "address": "honor palace",
 *           "time": "1970-01-13T23:43:42.222Z",
 *           "adminId": "5846d709fd28fc46dc18798c",
 *           "leaderId": "5846d894354af33c8061f2d5",
 *           "paperIds": [
 *             "5846d824354af33c8061f2c7",
 *             "5846d754e04a610eb81625bb",
 *             "5846d82a354af33c8061f2cf"
 *           ],
 *           "teacherIds": [
 *             "5846d8a4354af33c8061f2d8",
 *             "5846d894354af33c8061f2d5",
 *             "5846d707fd28fc46dc18798e"
 *           ],
 *           "studentIds": [
 *             "5846d8c4354af33c8061f2dd",
 *             "5846d8b6354af33c8061f2da",
 *             "5846d709fd28fc46dc187990"
 *           ],
 *           "finished": 2,
 *           "status": 1
 *         }
 *       },
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4NDZkNzA5ZmQyOGZjNDZkYzE4Nzk5MCIsImlhdCI6MTQ4MTI4MTM1NywiZXhwIjoxNDgxMzE3MzU3fQ.xzYq1elZNYrT-3mcnMSEsK4QslMg5RJfp-robE9fypg"
 *     }
 *
 * @apiSuccessExample {json} Admin-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *         "_id": "5846d705fd28fc46dc18798d",
 *         "name": "gly",
 *         "account": "gly",
 *         "phone": "18813752176",
 *         "email": "wubocong3@163.com",
 *         "school": "软件学院",
 *         "university": "华南农业大学",
 *         "gender": true,
 *         "role": "admin",
 *         "type": "User",
 *         "defenses": [
 *           {
 *             "_id": "5846d843354af33c8061f2d3",
 *             "name": "done",
 *             "address": "paradise",
 *             "time": "1970-01-13T23:43:42.222Z",
 *             "adminId": "5846d709fd28fc46dc18798c",
 *             "leaderId": "5846d894354af33c8061f2d5",
 *             "paperIds": [
 *               "5846d824354af33c8061f2c7",
 *               "5846d754e04a610eb81625bb",
 *               "5846d82a354af33c8061f2cf"
 *             ],
 *             "teacherIds": [
 *               "5846d8a4354af33c8061f2d8",
 *               "5846d894354af33c8061f2d5",
 *               "5846d707fd28fc46dc18798e"
 *             ],
 *             "studentIds": [
 *               "5846d8c4354af33c8061f2dd",
 *               "5846d8b6354af33c8061f2da",
 *               "5846d709fd28fc46dc187990"
 *             ],
 *             "finished": 3,
 *             "status": 2
 *           },
 *           {
 *             "_id": "5846d817354af33c8061f2c6",
 *             "name": "not ready",
 *             "address": "fucking hotel",
 *             "time": "1970-01-13T23:43:42.222Z",
 *             "adminId": "5846d709fd28fc46dc18798c",
 *             "paperIds": [],
 *             "teacherIds": [],
 *             "studentIds": [],
 *             "finished": 0,
 *             "status": 0
 *           },
 *           {
 *             "_id": "5846d84d354af33c8061f2d4",
 *             "name": "ing",
 *             "address": "honor palace",
 *             "time": "1970-01-13T23:43:42.222Z",
 *             "adminId": "5846d709fd28fc46dc18798c",
 *             "leaderId": "5846d894354af33c8061f2d5",
 *             "paperIds": [
 *               "5846d824354af33c8061f2c7",
 *               "5846d754e04a610eb81625bb",
 *               "5846d82a354af33c8061f2cf"
 *             ],
 *             "teacherIds": [
 *               "5846d8a4354af33c8061f2d8",
 *               "5846d894354af33c8061f2d5",
 *               "5846d707fd28fc46dc18798e"
 *             ],
 *             "studentIds": [
 *               "5846d8c4354af33c8061f2dd",
 *               "5846d8b6354af33c8061f2da",
 *               "5846d709fd28fc46dc187990"
 *             ],
 *             "finished": 2,
 *             "status": 1
 *           }
 *         ]
 *       },
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4NDZkNzA1ZmQyOGZjNDZkYzE4Nzk4YyIsImlhdCI6MTQ4MTI4MTQ2NCwiZXhwIjoxNDgxMzE3NDY0fQ.GOI4mpvetrs9jyHwgw4NKIDHjC-eEpGS-LIFrz-ycsM"
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
          const data = (await Admin.findOne({adminId: user._id}, '-type -adminId')).toJSON()
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
      user: {...response, ...role},
      token: ctx.body.token,
    }
  } catch (err) {
    logger.error(ctx.url + ' ' + err.message)
    if (err.message === '404' || err.name === 'CastError') {
      ctx.throw(404, 'Not Found')
    }
    ctx.throw(500, err.message)
  }
}

/**
 * @api {put} /users/:id Update a user
 * @apiPermission User
 * @apiVersion 0.4.0
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
    logger.error(ctx.url + ' ' + err.message)
    ctx.throw(401, err.message)
  }
  ctx.body = {
    update: true,
  }
}

/**
 * @api {delete} /users/:id Delete a user
 * @apiPermission SuperAdmin
 * @apiVersion 0.4.0
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
    logger.error(ctx.url + ' ' + err.message)
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
 * @apiVersion 0.4.0
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
    logger.error(ctx.url + ' ' + err.message)
    ctx.throw(401, err.message)
  }
}

/**
 * @api {get} /users/me Get personal user
 * @apiPermission User personally
 * @apiVersion 0.4.0
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
    user: ctx.state.user.toJSON(),
  }
}

/**
 * @api {get} /users/contactAdmin Get admin's email and phone number
 * @apiPermission All
 * @apiVersion 0.4.0
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
    logger.error(ctx.url + ' ' + err.message)
    if (err.message === '404' || err.name === 'CastError') {
      ctx.throw(404, 'Not Found')
    }
    ctx.throw(500, 'Internal Server Error')
  }
}

/**
 * @api {post} /users/admin Create a new admin
 * @apiPermission User
 * @apiVersion 0.4.0
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
    logger.error(ctx.url + ' ' + err.message)
    ctx.throw(422, err.message)
    await Promise.all([user.remove && user.remove(), admin.remove && admin.remove()])
  }
}

/**
 * @api {post} /users/teachers Create teachers
 * @apiPermission Admin
 * @apiVersion 0.4.0
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
      logger.error(ctx.url + ' ' + err.message)
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
 * @apiVersion 0.4.0
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
      logger.error(ctx.url + ' ' + err.message)
      ctx.throw(422, err.message)
      await Promise.all([newUser.remove && newUser.remove(), role.remove && role.remove()])
    }
  }))
  ctx.body = {
    userIds,
  }
}
