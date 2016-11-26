import Paper from '../../models/papers'
import Student from '../../models/students'
import Teacher from '../../models/teachers'

/**
 * @api {post} /papers Create a new paper
 * @apiPermission Student
 * @apiVersion 0.2.0
 * @apiName CreatePaper
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "paper": { "name": "How to become a millionaire", "studentId": "56bd1da600a526986cf65c80", "teacherId": "56bd1da600a526986cf65c80","filePath": "http://localhost:5000/file/1s2d1da600a526986cf85c4f","fileSize": 1022392,"desp": "fuckfuckfuck", "lastModifiedDate": 1480155509491} }' localhost:5000/papers
 *
 * @apiParam {Object}   paper                   Paper object (required)
 * @apiParam {String}   paper.name              Paper name.
 * @apiParam {String}   paper.studentId         Id of student.
 * @apiParam {String}   paper.teacherId         Id of student's teacher.
 * @apiParam {String}   paper.filePath          Paper file's path
 * @apiParam {Number}   paper.fileSize          Paper doc's size in bytes
 * @apiParam {String}   paper.desp              Paper description
 * @apiParam {Number}   paper.lastModifiedDate  Last modified date of document
 *
 * @apiSuccess {ObjectId}    id      Paper id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "56bd1da600a526986cf65c80"
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
export async function createPaper(ctx) {
  try {
    const paper = new Paper(ctx.request.fields.paper)
    await paper.save()

    ctx.body = {
      id: paper._id,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

/**
 * @api {get} /papers Get all paper
 * @apiPermission SuperAdmin
 * @apiVersion 0.2.0
 * @apiName GetPapers
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/papers
 *
 * @apiSuccess {Object[]} papers                   Array of paper objects
 * @apiSuccess {ObjectId} papers._id               Paper id
 * @apiSuccess {String}   papers.name              Paper name
 * @apiSuccess {String}   papers.studentId         Id of student
 * @apiSuccess {String}   papers.teacherId         Id of student's teacher
 * @apiSuccess {String}   papers.filePath          Paper file's path
 * @apiSuccess {Number}   papers.fileSize          Paper doc's size in bytes
 * @apiSuccess {String}   papers.desp              Paper description
 * @apiSuccess {Number}   papers.lastModifiedDate  Last modified date of document
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "papers": [{
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "How to become a millionaire"
 *          "studentId": "56bd1da600a526986cf65c80"
 *          "teacherId": "56bd1da600a526986cf65c80"
 *          "filePath": "http://localhost:5000/file/1s2d1da600a526986cf85c4f"
 *          "fileSize": 1022392
 *          "desp": "fuckfuckfuck"
 *          "lastModifiedDate": 1480155509491
 *       }]
 *     }
 *
 * @apiUse TokenError
 */
export async function getPapers(ctx) {
  const papers = await Paper.find({})
  ctx.body = {
    papers,
  }
}

/**
 * @api {get} /papers/:id Get paper by id
 * @apiPermission Admin
 * @apiVersion 0.2.0
 * @apiName GetPaper
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/papers/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object[]} paper                   Paper object (required)
 * @apiSuccess {ObjectId} paper._id               Paper id
 * @apiSuccess {String}   paper.name              Paper name.
 * @apiSuccess {String}   paper.studentId         Id of student.
 * @apiSuccess {String}   paper.teacherId         Id of student's teacher.
 * @apiSuccess {String}   paper.filePath          Paper file's path
 * @apiSuccess {Number}   paper.fileSize          Paper doc's size in bytes
 * @apiSuccess {String}   paper.desp              Paper description
 * @apiSuccess {Number}   paper.lastModifiedDate  Last modified date of document
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "paper": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "How to become a millionaire"
 *          "studentId": "56bd1da600a526986cf65c80"
 *          "teacherId": "56bd1da600a526986cf65c80"
 *          "filePath": "http://localhost:5000/file/1s2d1da600a526986cf85c4f"
 *          "fileSize": 1022392
 *          "desp": "fuckfuckfuck"
 *          "lastModifiedDate": 1480155509491
 *       }
 *     }
 *
 * @apiUse TokenError
 */
export async function getPaper(ctx, next) {
  const id = ctx.params.id
  try {
    let paper = await Paper.findById(id)
    if (!paper) {
      ctx.throw(404)
    }

    ctx.body = {
      paper,
    }
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }

  if (next) {
    return next()
  }
}

/**
 * @api {put} /papers/:id Update a paper
 * @apiPermission Student
 * @apiVersion 0.2.0
 * @apiName UpdatePaper
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "paper": { "name": "How to become a millionaire", "studentId": "56bd1da600a526986cf65c80", "teacherId": "56bd1da600a526986cf65c80","filePath": "http://localhost:5000/file/1s2d1da600a526986cf85c4f","fileSize": 1022392,"desp": "fuckfuckfuck", "lastModifiedDate": 1480155509491} }' localhost:5000/papers/56bd1da600a526986cf65c80
 *
 * @apiParam {Object}   paper                   Paper object (required)
 * @apiParam {String}   paper.name              Paper name.
 * @apiParam {String}   paper.studentId         Id of student.
 * @apiParam {String}   paper.teacherId         Id of student's teacher.
 * @apiParam {String}   paper.filePath          Paper file's path
 * @apiParam {Number}   paper.fileSize          Paper doc's size in bytes
 * @apiParam {String}   paper.desp              Paper description
 * @apiParam {Number}   paper.lastModifiedDate  Last modified date of document
 *
 * @apiSuccess {StatusCode} 200
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "update": true
 *     }
 *
 * @apiError Unauthorized Incorrect credentials
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
export async function updatePaper(ctx) {
  const paper = ctx.body.paper

  Object.assign(paper, ctx.request.fields.paper)

  await paper.save()

  ctx.body = {
    update: true,
  }
}

/**
 * @api {get} /papers/me Get personal paper
 * @apiPermission Student
 * @apiVersion 0.2.0
 * @apiName GetMyPaper
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/papers/me
 *
 * @apiSuccess {Object[]} paper                   Paper object
 * @apiSuccess {ObjectId} paper._id               Paper id
 * @apiSuccess {String}   paper.name              Paper name
 * @apiSuccess {String}   paper.studentId         Id of student
 * @apiSuccess {String}   paper.teacherId         Id of student's teacher
 * @apiSuccess {String}   paper.filePath          Paper file's path
 * @apiSuccess {Number}   paper.fileSize          Paper doc's size in bytes
 * @apiSuccess {String}   paper.desp              Paper description
 * @apiSuccess {Number}   paper.lastModifiedDate  Last modified date of document
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "paper": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "How to become a millionaire"
 *          "studentId": "56bd1da600a526986cf65c80"
 *          "teacherId": "56bd1da600a526986cf65c80"
 *          "filePath": "http://localhost:5000/file/1s2d1da600a526986cf85c4f"
 *          "fileSize": 1022392
 *          "desp": "fuckfuckfuck"
 *          "lastModifiedDate": 1480155509491
 *       }
 *     }
 *
 * @apiUse TokenError
 */
export async function getMyPaper(ctx) {
  const id = ctx.state.user._id
  try {
    let paper = await Paper.find({studentId: id})
    if (!paper) {
      ctx.throw(404)
    }

    ctx.body = {
      paper,
    }
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }
}
