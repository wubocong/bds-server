import Student from '../../models/students'

/**
 * @api {post} /students Create a new student
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName CreateStudent
 * @apiGroup Students
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "student": { "studentname": "johndoe", "password": "secretpasas" } }' localhost:5000/students
 *
 * @apiParam {Object} student          Student object (required)
 * @apiParam {String} student.studentname Studentname.
 * @apiParam {String} student.password Password.
 *
 * @apiSuccess {Object}   students           Student object
 * @apiSuccess {ObjectId} students._id       Student id
 * @apiSuccess {String}   students.name      Student name
 * @apiSuccess {String}   students.studentname  Student studentname
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "student": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "studentname": "johndoe"
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
export async function createStudent (ctx) {
  const student = new Student(ctx.request.fields.student)
  try {
    await student.save()
  } catch (err) {
    ctx.throw(422, err.message)
  }

  const token = student.generateToken()
  const response = student.toJSON()

  delete response.password

  ctx.body = {
    student: response,
    token
  }
}

/**
 * @api {get} /students Get all students
 * @apiPermission student
 * @apiVersion 1.0.0
 * @apiName GetStudents
 * @apiGroup Students
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/students
 *
 * @apiSuccess {Object[]} students           Array of student objects
 * @apiSuccess {ObjectId} students._id       Student id
 * @apiSuccess {String}   students.name      Student name
 * @apiSuccess {String}   students.studentname  Student studentname
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "students": [{
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "studentname": "johndoe"
 *       }]
 *     }
 *
 * @apiUse TokenError
 */
export async function getStudents (ctx) {
  const students = await Student.find({}, '-password')
  ctx.body = { students }
}

/**
 * @api {get} /students/:id Get student by id
 * @apiPermission student
 * @apiVersion 1.0.0
 * @apiName GetStudent
 * @apiGroup Students
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/students/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   students           Student object
 * @apiSuccess {ObjectId} students._id       Student id
 * @apiSuccess {String}   students.name      Student name
 * @apiSuccess {String}   students.studentname  Student studentname
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "student": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "studentname": "johndoe"
 *       }
 *     }
 *
 * @apiUse TokenError
 */
export async function getStudent (ctx, next) {
  try {
    const student = await Student.findById(ctx.params.id, '-password')
    if (!student) {
      ctx.throw(404)
    }

    ctx.body = {
      student
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
 * @api {put} /students/:id Update a student
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName UpdateStudent
 * @apiGroup Students
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "student": { "name": "Cool new Name" } }' localhost:5000/students/56bd1da600a526986cf65c80
 *
 * @apiParam {Object} student          Student object (required)
 * @apiParam {String} student.name     Name.
 * @apiParam {String} student.studentname Studentname.
 *
 * @apiSuccess {Object}   students           Student object
 * @apiSuccess {ObjectId} students._id       Student id
 * @apiSuccess {String}   students.name      Updated name
 * @apiSuccess {String}   students.studentname  Updated studentname
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "student": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "Cool new name"
 *          "studentname": "johndoe"
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
export async function updateStudent (ctx) {
  const student = ctx.body.student

  Object.assign(student, ctx.request.fields.student)

  await student.save()

  ctx.body = {
    student
  }
}

/**
 * @api {delete} /students/:id Delete a student
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName DeleteStudent
 * @apiGroup Students
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X DELETE localhost:5000/students/56bd1da600a526986cf65c80
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

export async function deleteStudent (ctx) {
  const student = ctx.body.student

  await student.remove()

  ctx.status = 200
  ctx.body = {
    success: true
  }
}
