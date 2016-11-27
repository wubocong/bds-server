import Student from '../../models/students'
import Paper from '../../models/papers'

export async function createStudent(ctx, id) {
  const student = new Student({...ctx.request.fields.user, studentId: id})
  try {
    await student.save()
  } catch (err) {
    throw (422, err.message)
  }
}

/**
 * @api {put} /students/:id Update a student
 * @apiPermission Admin
 * @apiVersion 0.2.0
 * @apiName UpdateStudent
 * @apiGroup Students
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "student": { "studentId": "56bd1da600a526986cf65c80", "defenseId": "56bd1da600a526986cf65c80", "paperId": "56bd1da600a526986cf65c80" } }' localhost:5000/students/56bd1da600a526986cf65c80
 *
 * @apiParam {Object}     student             Student object (required)
 * @apiParam {ObjectId}   student.studentId   Student's user id.
 * @apiParam {ObjectId}   student.defenseId   Student's defenseId.
 * @apiParam {ObjectId}   student.paperId     Student's paperId.
 *
 * @apiSuccess {StatusCode} 200
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
export async function updateStudent(ctx) {
  const newStudent = ctx.request.fields.student
  let student
  try {
    student = await Student.find({studentId: newStudent._id})
  } catch (err) {
    ctx.throw(422, err.message)
  }
  if (newStudent.paperId) {
    try {
      const paper = await Paper.findById(newStudent.paperId)
      paper.studentId = newStudent._id
      student.paperId = newStudent.paperId
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }
  if (newStudent.defenseId) {
    try {
      const defense = await Paper.findById(newStudent.defenseId)
      defense.studentId = newStudent._id
      student.defenseId = newStudent.defenseId
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }

  await student.save()

  ctx.body = {
    update: true,
  }
}

/**
 * @api {delete} /students/:id Delete a student
 * @apiPermission Admin
 * @apiVersion 0.2.0
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

export async function deleteStudent(ctx) {
  const student = ctx.body.student

  await student.remove()

  ctx.status = 200
  ctx.body = {
    success: true,
  }
}

