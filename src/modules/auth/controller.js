import passport from 'koa-passport'
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
 *     HTTP/1.1 500 InternalServerError
 *     {
 *       "status": 500,
 *       "error": "InternalServerError"
 *     }
 */


/**
 * @apiDefine UserDetailInfo
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
 */

/**
 * @api {post} /auth Authenticate user
 * @apiVersion 0.4.4
 * @apiName AuthUser
 * @apiGroup Auth
 *
 * @apiParam {String} account   User account.
 * @apiParam {String} password  User password.
 * @apiParam {String} role      User role.
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "account": "20090909", "password": "foo", "role": "teacher" }' localhost:5000/auth
 *
 * @apiUse UserDetailInfo
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

export async function authUser(ctx, next) {
  return passport.authenticate('local', async (user) => {
    if (!user || (ctx.request.fields.role || 'student') !== user.role) {
      ctx.throw(401)
    }

    logger.info(ctx.url + ' ' + user)

    const token = user.generateToken()

    ctx.body = {
      user,
      token,
    }
    if (next) {
      return next()
    }
  })(ctx, next)
}
