import Defense from '../../models/defenses'
import Paper from '../../models/papers'
import User from '../../models/users'
import Student from '../../models/students'
import Teacher from '../../models/teachers'
import Admin from '../../models/admins'
const logger = require('koa-log4').getLogger('index')

/**
 * @api {post} /defenses Create a defense
 * @apiPermission Admin
 * @apiVersion 0.4.0-alpha.1
 * @apiName CreateDefense
 * @apiGroup Defenses
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "defense": {"name":"华南农业大学", "status": 2, "studentIds": ["{{studentId}}"], "teacherIds":["{{teacherId}}"], "adminIds":["{{adminId}}"], "paperIds": ["{{paperId}}"], "address": "7 day inn", "time": "1122" }' localhost:5000/defenses
 *
 * @apiParam {Object}       defense              Defense object (required)
 * @apiParam {String}       defense.name         Defense name (required)
 * @apiParam {String}       defense.address      Defense address (required)
 * @apiParam {Date}         defense.time         Defense time (required)
 * @apiParam {Number}       defense.status       Defense status(0-3)
 * @apiParam {ObjectId[]}   defense.studentIds   Defense students' ids
 * @apiParam {ObjectId[]}   defense.teacherIds   Defense teachers' ids
 * @apiParam {ObjectId[]}   defense.adminIds     Defense admins' ids
 * @apiParam {ObjectId[]}   defense.paperIds     Defense papers' ids
 * @apiParam {ObjectId}     defense.leaderId     Id of teachers' leader
 *
 * @apiSuccess {Object}     defense            Defense Object
 * @apiSuccess {ObjectId}   defense._id        Defense id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "defense": {
 *         "_id": "56bd1da600a526986cf65c80"
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
 * @apiUse TokenError
 */
export async function createDefense(ctx) {
  const defense = ctx.request.fields.defense
  try {
    defense.adminId = defense.adminId || ctx.state.user._id
    const newDefense = new Defense(defense)
    await newDefense.save()
    logger.info(newDefense)

    await Promise.all([
      Admin.findOneAndUpdate({
        adminId: newDefense.adminId,
      }, {
        $addToSet: {
          defenseIds: newDefense._id,
        },
      }),
      Promise.all(newDefense.teacherIds.map(async(teacherId) => {
        await Teacher.findOneAndUpdate({
          teacherId,
        }, {
          $addToSet: {
            defenseIds: newDefense._id,
          },
        })
      })),
      Promise.all(newDefense.studentIds.map(async(studentId) => {
        await Student.findOneAndUpdate({
          studentId,
        }, {
          $set: {
            defenseId: newDefense._id,
          },
        })
      })),
      Promise.all(newDefense.paperIds.map(async(paperId) => {
        await Paper.findOneAndUpdate({
          paperId,
        }, {
          $set: {
            defenseId: newDefense._id,
          },
        })
      })),
    ])
    ctx.body = {
      defense: {
        _id: newDefense._id,
      },
    }
  } catch (err) {
    logger.error(ctx.url + ' ' + err.message)
    ctx.throw(422, err.message)
  }
}

async function getDefense(id) {
  return await Defense.findById(id)
}

/**
 * @api {get} /defenses Get all defenses
 * @apiPermission Admin
 * @apiVersion 0.4.0-alpha.1
 * @apiName GetDefenses
 * @apiGroup Defenses
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/defenses
 *
 * @apiSuccess {Object[]}     defenses              Defense objects
 * @apiSuccess {ObjectId}     defenses._id          Defense id
 * @apiSuccess {String}       defenses.name         Defense name
 * @apiSuccess {String}       defenses.address      Defense address
 * @apiSuccess {Date}         defenses.time         Defense time
 * @apiSuccess {Number}       defenses.status       Defense status(0-3)
 * @apiSuccess {ObjectId[]}   defenses.studentIds   Defense students' ids
 * @apiSuccess {ObjectId[]}   defenses.teacherIds   Defense teachers' ids
 * @apiSuccess {ObjectId[]}   defenses.adminIds     Defense admins' ids
 * @apiSuccess {ObjectId[]}   defenses.paperIds     Defense papers' ids
 * @apiSuccess {ObjectId}     defenses.leaderId     Id of teachers' leader
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "defenses": [
 *         {
 *           "_id": "583ea545a180765d1b9aa4ce",
 *           "name": "华南农业大学",
 *           "address": "7 day inn",
 *           "time": "1970-01-01T00:00:01.122Z",
 *           "paperIds": [
 *             "583e9d201d17a94b1c81932f"
 *           ],
 *           "adminIds": [
 *             "583e8fb7de1723468cd09cb4"
 *           ],
 *           "teacherIds": [
 *             "583ea43ca180765d1b9aa4ca"
 *           ],
 *           "studentIds": [
 *             "583ea29584fbf44f47eb8129"
 *           ],
 *           "status": 1
 *         }
 *       ]
 *     }
 *
 * @apiUse TokenError
 */

export async function getDefenses(ctx, next) {
  const defenses = await Defense.find()
  ctx.body = {
    defenses,
  }
  if (next) {
    return next()
  }
}

/**
 * @api {put} /defenses/:id Update a defense
 * @apiPermission Admin
 * @apiVersion 0.4.0-alpha.1
 * @apiName UpdateDefense
 * @apiGroup Defenses
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "defense": { "address": "小米公司", "time": 1479891536874 } }' localhost:5000/defenses/56bd1da600a526986cf65c80
 *
 * @apiParam {Object[]}     defense              Defense objects (required)
 * @apiParam {String}       defense.name         Defense name
 * @apiParam {String}       defense.address      Defense address
 * @apiParam {Date}         defense.time         Defense time
 * @apiParam {Number}       defense.status       Defense status(0-3)
 * @apiParam {ObjectId}     defense.leaderId     Id of teachers' leader
 * @apiParam {ObjectId}     defense.adminId      Defense admin's id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "updateDefense": true
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

export async function updateDefense(ctx) {
  try {
    const {name, time, address, status, leaderId, adminId} = ctx.request.fields.defense
    const filter = {name, time, address, status, leaderId, adminId}
    const defense = await getDefense(ctx.params.id)
    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        defense[key] = filter[key]
      }
    })
    await defense.save()
    ctx.body = {
      updateDefense: true,
    }
  } catch (err) {
    logger.error(ctx.url + ' ' + err.message)
    ctx.throw(422, err.message)
  }
}

/**
 * @api {put} /defenses/addStudents/:id Add students to defense
 * @apiPermission Admin
 * @apiVersion 0.4.0-alpha.1
 * @apiName AddStudentsToDefense
 * @apiGroup Defenses
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "studentIds": [ "56bd1da600a526986cf65c80", "56bd1da600a526986cf65c81" ] }' localhost:5000/defenses/56bd1da600a526986cf65c80
 *
 * @apiParam {ObjectId[]}   studentIds       Students' ids (required)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "addStudentsToDefense": true
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

export async function addStudentsToDefense(ctx) {
  try {
    const defense = await getDefense(ctx.params.id)
    const {studentIds, paperIds} = defense.toJSON()
    ctx.request.fields.studentIds.forEach(async (studentId, i) => {
      if (!defense.studentIds.includes(studentId)) {
        paperIds.push((await Student.findOne({studentId})).paperId)
        studentIds.push(studentId)
      }
    })
    Object.assign(defense, {studentIds, paperIds})
    await defense.save()
    ctx.body = {
      addStudentsToDefense: true,
    }
  } catch (err) {
    logger.error(ctx.url + ' ' + err.message)
    ctx.throw(422, err.message)
  }
}

/**
 * @api {put} /defenses/ Update defenses
 * @apiPermission SuperAdmin
 * @apiVersion 0.4.0-alpha.1
 * @apiName UpdateDefenses
 * @apiGroup Defenses
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "defenses": [{ "_id": "56bd1da600a526986cf65c80", "studentId": "56bd1da600a526986cf65c80", "paperId": "56bd1da600a526986cf65c80", "scores": [{"teacherId": "56bd1da600a526986cf65c80", "sum": 100, "items": [50, 20, 30]}], "remark": "bad guy", "time": 1479891536874 }] }' localhost:5000/defenses
 *
 * @apiParam {Object[]}     defenses              Defense objects (required)
 * @apiParam {ObjectId}     defenses._id          Defense id (required)
 * @apiParam {String}       defenses.name         Defense name
 * @apiParam {String}       defenses.address      Defense address
 * @apiParam {Date}         defenses.time         Defense time
 * @apiParam {Number}       defenses.status       Defense status(0-3)
 * @apiParam {ObjectId[]}   defenses.studentIds   Defense students' ids
 * @apiParam {ObjectId[]}   defenses.teacherIds   Defense teachers' ids
 * @apiParam {ObjectId[]}   defenses.adminIds     Defense admins' ids
 * @apiParam {ObjectId[]}   defenses.paperIds     Defense papers' ids
 * @apiParam {ObjectId}     defenses.leaderId     Id of teachers' leader
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

export async function updateDefenses(ctx) {
  try {
    await Promise.all(ctx.request.fields.defenses.map(async(defense) => {
      await Object.assign((await getDefense(defense._id)), defense).save()
    }))
    ctx.body = {
      update: true,
    }
  } catch (err) {
    logger.error(ctx.url + ' ' + err.message)
    ctx.throw(422, err.message)
  }
}

/**
 * @api {delete} /defenses Delete defenses
 * @apiPermission Admin
 * @apiVersion 0.4.0-alpha.1
 * @apiName DeleteDefenses
 * @apiGroup Defenses
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X DELETE -d '{ "defenseIds": ["56bd1da600a526986cf65c80"] }' localhost:5000/defenses
 *
 * @apiParam {ObjectId[]}    defenseIds  Defenses' id to be deleted.
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

export async function deleteDefenses(ctx) {
  try {
    await Promise.all(ctx.request.fields.defenseIds.map(async(id) => {
      await (await getDefense(id)).remove()
    }))
    ctx.body = {
      delete: true,
    }
  } catch (err) {
    logger.error(ctx.url + ' ' + err.message)
    ctx.throw(422, err.message)
  }
}

/**
 * @api {get} /defenses/:id Get a defense
 * @apiPermission User
 * @apiVersion 0.4.0-alpha.1
 * @apiName GetDefense
 * @apiGroup Defenses
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/defenses/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object[]}     defense              Defense objects
 * @apiSuccess {ObjectId}     defense._id          Defense id
 * @apiSuccess {String}       defense.name         Defense name
 * @apiSuccess {String}       defense.address      Defense address
 * @apiSuccess {Date}         defense.time         Defense time
 * @apiSuccess {Number}       defense.status       Defense status(0-3)
 * @apiSuccess {ObjectId[]}   defense.studentIds   Defense students' ids
 * @apiSuccess {ObjectId[]}   defense.teacherIds   Defense teachers' ids
 * @apiSuccess {ObjectId[]}   defense.adminIds     Defense admins' ids
 * @apiSuccess {ObjectId[]}   defense.paperIds     Defense papers' ids
 * @apiSuccess {ObjectId}     defense.leaderId     Id of teachers' leader
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "defense": {
 *         "_id": "583ea545a180765d1b9aa4ce",
 *         "name": "华南农业大学",
 *         "address": "7 day inn",
 *         "time": "1970-01-01T00:00:01.122Z",
 *         "paperIds": [
 *           "583e9d201d17a94b1c81932f"
 *         ],
 *         "adminIds": [
 *           "583e8fb7de1723468cd09cb4"
 *         ],
 *         "teacherIds": [
 *           "583ea43ca180765d1b9aa4ca"
 *         ],
 *         "studentIds": [
 *           "583ea29584fbf44f47eb8129"
 *         ],
 *         "status": 1
 *       }
 *     }
 *
 * @apiUse TokenError
 */

export async function getMyDefense(ctx) {
  try {
    const defense = await Defense.find({
      studentId: ctx.state.user._id,
    })
    ctx.body = {
      defense,
    }
  } catch (err) {
    logger.error(ctx.url + ' ' + err.message)
    ctx.throw(401)
  }
}

/**
 * @api {get} /defenses/detail/:id Get a defense's detailed info
 * @apiPermission Admin
 * @apiVersion 0.4.0-alpha.1
 * @apiName GetDefenseDetail
 * @apiGroup Defenses
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/defenses/detail/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object[]}     defense              Defense objects
 * @apiSuccess {ObjectId}     defense._id          Defense id
 * @apiSuccess {String}       defense.name         Defense name
 * @apiSuccess {String}       defense.address      Defense address
 * @apiSuccess {Date}         defense.time         Defense time
 * @apiSuccess {Number}       defense.status       Defense status(0-3)
 * @apiSuccess {Object[]}     defense.students     Defense students
 * @apiSuccess {Object[]}     defense.teachers     Defense teachers
 * @apiSuccess {ObjectId}     defense.leaderId     Id of teachers' leader
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "defense": {
 *         "_id": "583ea545a180765d1b9aa4ce",
 *         "name": "华南农业大学",
 *         "address": "7 day inn",
 *         "time": "1970-01-01T00:00:01.122Z",
 *         "teachers": [{
 *           "_id": "583ea43ca180765d1b9aa4ca"
 *         }],
 *         "students": [{
 *           "_id": "583ea29584fbf44f47eb8129"
 *         }],
 *         "status": 1
 *       }
 *     }
 *
 * @apiUse TokenError
 */

export async function getDefenseDetail(ctx) {
  const defense = await Defense.findById(ctx.params.id, '-adminIds -paperIds')
  if (!defense) {
    throw new Error(404)
  }
  let teachers = []
  let students = []
  try {
    await Promise.all([
      await Promise.all((defense.teacherIds || []).map(async(teacherId) => {
        const teacher = await User.findById(teacherId, '-type -password -account -role')
        if (teacher) {
          teachers.push(teacher.toJSON())
        }
      })),
      await Promise.all((defense.studentIds || []).map(async(studentId) => {
        await Promise.all([User.findById(studentId, '-type -password -role'), Student.findOne({
          studentId,
        }, '-type')])
          .then(async([user, student]) => {
            let paper
            let teacher

            await Promise.all([
              student && Paper.findById(student.paperId),
              student && User.findById(student.teacherId, '-type -password -account -role'),
            ]).then((values) => {
              [paper, teacher] = values
            })

            const response = student.toJSON()
            delete response.teacherId
            delete response.paperId
            if (student) {
              students.push({
                ...response,
                ...user.toJSON(),
                paper,
                teacher,
              })
            }
          })
      })),
    ])
  } catch (err) {
    ctx.throw(500, err.message)
  }
  const response = defense.toJSON()
  delete response.teacherIds
  delete response.studentIds
  ctx.body = {
    defense: {
      ...response,
      teachers,
      students,
    },
  }
}
