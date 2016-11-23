import Defense from '../../models/defenses'

/**
 * @api {post} /defenses Create defenses
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName CreateDefense
 * @apiGroup Defenses
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "defenses": [{ "student": "56bd1da600a526986cf65c80", "paper": "secretpasas", "scores": [{"teacherId": "56bd1da600a526986cf65c80", "sum": 100, "items": [50, 20, 30]}], "remark": "bad guy", "time": 1479891536874 }] }' localhost:5000/defenses
 *
 * @apiParam {Object[]} defenses          Defenses array (required)
 * @apiParam {String} defenses.student Defense student's id (required).
 * @apiParam {String} defenses.paper Paper's id (required).
 * @apiParam {Object[]} defenses.scores Defense scores array.
 * @apiParam {Number[]} defenses.scores.items Each item of teacher's scores.
 * @apiParam {String} defenses.scores.teacherId Teacher's id.
 * @apiParam {Number} defenses.scores.sum Sum of each teacher's scores.
 * @apiParam {String} defenses.remark Defense's remark.
 * @apiParam {Number} defenses.time Defense's time (default to current time).
 *
 * @apiSuccess {String[]}   defenseIds           Defenses' ids
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "defenseIds": ["56bd1da600a526986cf65c80"]
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
export async function createDefenses (ctx) {
  const defenseIds = []
  try {
    await Promise.all(ctx.request.fields.defenses.map(async (defense) => {
      const newDefense = new Defense({...defense, student: ctx.state.student._id, paper: ctx.request.fields.paper})
      await newDefense.save()
      defenseIds.push(newDefense._id)
    }))
    ctx.body = {
      defenseIds,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

async function getDefense (id) {
  return await Defense.findById(id)
}

/**
 * @api {get} /defenses/ Get defenses
 * @apiPermission defense
 * @apiVersion 1.0.0
 * @apiName GetDefense
 * @apiGroup Defenses
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/defenses/
 *
 * @apiSuccess {Object[]}   defenses           Defense objects
 * @apiSuccess {String} defenses.student Defense student's id (required).
 * @apiSuccess {String} defenses.paper Paper's id (required).
 * @apiSuccess {Object[]} defenses.scores Defense scores array.
 * @apiSuccess {Number[]} defenses.scores.items Each item of teacher's scores.
 * @apiSuccess {String} defenses.scores.teacherId Teacher's id.
 * @apiSuccess {Number} defenses.scores.sum Sum of each teacher's scores.
 * @apiSuccess {String} defenses.remark Defense's remark.
 * @apiSuccess {Number} defenses.time Defense's time (default to current time).
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "defenses": [{
 *          "_id": "56bd1da600a526986cf65c80"
 *          "student": "56bd1da600a526986cf65c80"
 *          "paper": "secretpasas"
 *          "scores": [{
 *            "teacherId": "56bd1da600a526986cf65c80"
 *            "sum": 100
 *            "items": [50, 20, 30]
 *          }]
 *          "remark": "bad guy"
 *          "time": 1479891536874
 *       }]
 *     }
 *
 * @apiUse TokenError
 */

export async function getDefenses (ctx, next) {
  // ctx.state中储存了koa-passport解析的用户会话信息
  const defenses = await Defense.find({student: ctx.state.student._id})
  ctx.body = {
    defenses,
  }
  if (next) {
    return next()
  }
}

/**
 * @api {put} /defenses/ Update defenses
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName UpdateDefense
 * @apiGroup Defenses
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "defense": [{ "student": "56bd1da600a526986cf65c80", "paper": "secretpasas", "scores": [{"teacherId": "56bd1da600a526986cf65c80", "sum": 100, "items": [50, 20, 30]}], "remark": "bad guy", "time": 1479891536874 }] }' localhost:5000/defenses/56bd1da600a526986cf65c80
 *
 * @apiParam {Object} defenses          Defenses array (required)
 * @apiParam {String} defenses.student Defense student's id (required).
 * @apiParam {String} defenses.paper Paper's id (required).
 * @apiParam {Object[]} defenses.scores Defense scores array.
 * @apiParam {Number[]} defenses.scores.items Each item of teacher's scores.
 * @apiParam {String} defenses.scores.teacherId Teacher's id.
 * @apiParam {Number} defenses.scores.sum Sum of each teacher's scores.
 * @apiParam {String} defenses.remark Defense's remark.
 * @apiParam {Number} defenses.time Defense's time (default to current time).
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

export async function updateDefenses (ctx) {
  try {
    await Promise.all(ctx.request.fields.defenses.map(async (defense) => {
      await Object.assign((await getDefense(defense._id)), defense).save()
    }))
    ctx.body = {
      update: true,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

/**
 * @api {delete} /defenses/ Delete defenses
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName DeleteDefense
 * @apiGroup Defenses
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X DELETE -d '{ "defenseIds": ["56bd1da600a526986cf65c80"] }' localhost:5000/defenses/
 *
 * @apiParam {String[]} defenseIds Defenses' id to be deleted.
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

export async function deleteDefenses (ctx) {
  try {
    await Promise.all(ctx.request.fields.defenseIds.map(async (id) => {
      await (await getDefense(id)).remove()
    }))
    ctx.body = {
      delete: true,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}
