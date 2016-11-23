import Teacher from '../../models/teachers'

/**
 * @api {post} /teachers Create a new teacher
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName CreateTeacher
 * @apiGroup Teachers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "teacher": { "teachername": "johndoe", "password": "secretpasas" } }' localhost:5000/teachers
 *
 * @apiParam {Object} teacher          Teacher object (required)
 * @apiParam {String} teacher.teachername Teachername.
 * @apiParam {String} teacher.password Password.
 *
 * @apiSuccess {Object}   teachers           Teacher object
 * @apiSuccess {ObjectId} teachers._id       Teacher id
 * @apiSuccess {String}   teachers.name      Teacher name
 * @apiSuccess {String}   teachers.teachername  Teacher teachername
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "teacher": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "teachername": "johndoe"
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
export async function createTeacher (ctx) {
  const teacher = new Teacher(ctx.request.fields.teacher)
  try {
    await teacher.save()
  } catch (err) {
    ctx.throw(422, err.message)
  }

  const token = teacher.generateToken()
  const response = teacher.toJSON()

  delete response.password

  ctx.body = {
    teacher: response,
    token
  }
}

/**
 * @api {get} /teachers Get all teachers
 * @apiPermission teacher
 * @apiVersion 1.0.0
 * @apiName GetTeachers
 * @apiGroup Teachers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/teachers
 *
 * @apiSuccess {Object[]} teachers           Array of teacher objects
 * @apiSuccess {ObjectId} teachers._id       Teacher id
 * @apiSuccess {String}   teachers.name      Teacher name
 * @apiSuccess {String}   teachers.teachername  Teacher teachername
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "teachers": [{
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "teachername": "johndoe"
 *       }]
 *     }
 *
 * @apiUse TokenError
 */
export async function getTeachers (ctx) {
  const teachers = await Teacher.find({}, '-password')
  ctx.body = { teachers }
}

/**
 * @api {get} /teachers/:id Get teacher by id
 * @apiPermission teacher
 * @apiVersion 1.0.0
 * @apiName GetTeacher
 * @apiGroup Teachers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/teachers/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   teachers           Teacher object
 * @apiSuccess {ObjectId} teachers._id       Teacher id
 * @apiSuccess {String}   teachers.name      Teacher name
 * @apiSuccess {String}   teachers.teachername  Teacher teachername
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "teacher": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "teachername": "johndoe"
 *       }
 *     }
 *
 * @apiUse TokenError
 */
export async function getTeacher (ctx, next) {
  try {
    const teacher = await Teacher.findById(ctx.params.id, '-password')
    if (!teacher) {
      ctx.throw(404)
    }

    ctx.body = {
      teacher
    }
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }

  if (next) { return next() }
}

/**
 * @api {put} /teachers/:id Update a teacher
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName UpdateTeacher
 * @apiGroup Teachers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "teacher": { "name": "Cool new Name" } }' localhost:5000/teachers/56bd1da600a526986cf65c80
 *
 * @apiParam {Object} teacher          Teacher object (required)
 * @apiParam {String} teacher.name     Name.
 * @apiParam {String} teacher.teachername Teachername.
 *
 * @apiSuccess {Object}   teachers           Teacher object
 * @apiSuccess {ObjectId} teachers._id       Teacher id
 * @apiSuccess {String}   teachers.name      Updated name
 * @apiSuccess {String}   teachers.teachername  Updated teachername
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "teacher": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "Cool new name"
 *          "teachername": "johndoe"
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
export async function updateTeacher (ctx) {
  const teacher = ctx.body.teacher

  Object.assign(teacher, ctx.request.fields.teacher)

  await teacher.save()

  ctx.body = {
    teacher
  }
}

/**
 * @api {delete} /teachers/:id Delete a teacher
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName DeleteTeacher
 * @apiGroup Teachers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X DELETE localhost:5000/teachers/56bd1da600a526986cf65c80
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

export async function deleteTeacher (ctx) {
  const teacher = ctx.body.teacher

  await teacher.remove()

  ctx.status = 200
  ctx.body = {
    success: true
  }
}
