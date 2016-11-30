import Paper from '../../models/papers'
import Student from '../../models/students'
import Teacher from '../../models/teachers'
const logger = require('koa-log4').getLogger('index')

/**
 * @api {post} /papers Create a new paper
 * @apiPermission Student
 * @apiVersion 0.3.0
 * @apiName CreatePaper
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "paper": { "name": "How to become a millionaire", "studentId": "56bd1da600a526986cf65c80", "teacherId": "56bd1da600a526986cf65c80", "desp": "fuckfuckfuck"} }' localhost:5000/papers
 *
 * @apiParam {Object}   paper                   Paper object (required)
 * @apiParam {String}   paper.name              Paper name (required)
 * @apiParam {String}   paper.studentId         Id of student (required)
 * @apiParam {String}   paper.teacherId         Id of student's teacher (required)
 * @apiParam {String}   paper.desp              Paper description (required)
 * @apiParam {Object[]} paper.scores            Defense scores
 * @apiParam {Number[]} paper.scores.items      Each item of teacher's scores
 * @apiParam {String}   paper.scores.teacherId  Teacher's id
 * @apiParam {Number}   paper.scores.sum        Sum of each teacher's scores
 * @apiParam {Boolean}  paper.scores.isLeader   Sum of each teacher's scores
 * @apiParam {Object}   paper.file              Paper file
 * @apiParam {String}   paper.file.name         Paper file's name
 * @apiParam {String}   paper.file.path         Paper file's path
 * @apiParam {Number}   paper.file.size         Paper file's size in bytes
 * @apiParam {Number}   paper.file.type         Paper file's type
 * @apiParam {Date}     paper.file.lastModified Paper file's last modified time
 * @apiParam {Object[]} paper.comments          Daily comments of tutor
 * @apiParam {String}   paper.comments.content  Content of comment
 * @apiParam {Date}     paper.comments.time     Create time of comment
 * @apiParam {Number}   paper.finalScore        Final score after defense
 * @apiParam {String}   paper.finalRemark       Final remark after defense
 * @apiParam {Date}     paper.lastModified      Last modified time of paper doc
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
 *
 * @apiUse TokenError
 */
export async function createPaper(ctx) {
  if (ctx.state.user.role !== 'student') {
    ctx.throw(401)
  }
  let paper = {...ctx.request.fields.paper, studentId: ctx.state.user._id, teacherId: ctx.state.role.teacherId, fileSize: 0, filePath: ''}
  try {
    paper = new Paper(paper)
    await paper.save()
    ctx.body = {
      id: paper._id,
    }
  } catch (err) {
    logger.error(err.message)
    ctx.throw(422, err.message)
  }
  logger.info(paper)
  try {
    await Student.findOneAndUpdate({studentId: ctx.state.user._id}, {$set: {paperId: paper._id}}, {safe: true, upsert: true})
    await Teacher.findOneAndUpdate({teacherId: ctx.state.role.teacherId}, {$addToSet: {paperIds: paper._id, studentIds: ctx.state.user._id}}, {safe: true, upsert: true})
  } catch (err) {
    logger.error(err.message)
    ctx.throw(401, err.message)
  }
}

/**
 * @api {get} /papers Get all paper
 * @apiPermission SuperAdmin
 * @apiVersion 0.3.0
 * @apiName GetPapers
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/papers
 *
 * @apiSuccess {Object[]} papers                   Paper objects
 * @apiSuccess {ObjectId} papers._id               Paper id
 * @apiSuccess {String}   papers.name              Paper name
 * @apiSuccess {String}   papers.studentId         Id of student
 * @apiSuccess {String}   papers.teacherId         Id of student's teacher
 * @apiSuccess {String}   papers.desp              Paper description
 * @apiSuccess {Object[]} papers.scores            Defense scores
 * @apiSuccess {Number[]} papers.scores.items      Each item of teacher's scores
 * @apiSuccess {String}   papers.scores.teacherId  Teacher's id
 * @apiSuccess {Number}   papers.scores.sum        Sum of each teacher's scores
 * @apiSuccess {Boolean}  papers.scores.isLeader   Sum of each teacher's scores
 * @apiSuccess {Object}   papers.file              Paper file
 * @apiSuccess {String}   papers.file.name         Paper file's name
 * @apiSuccess {String}   papers.file.path         Paper file's path
 * @apiSuccess {Number}   papers.file.size         Paper file's size in bytes
 * @apiSuccess {Number}   papers.file.type         Paper file's type
 * @apiSuccess {Date}     papers.file.lastModified Paper file's last modified time
 * @apiSuccess {Object[]} papers.comments          Daily comments of tutor
 * @apiSuccess {String}   papers.comments.content  Content of comment
 * @apiSuccess {Date}     papers.comments.time     Create time of comment
 * @apiSuccess {Number}   papers.finalScore        Final score after defense
 * @apiSuccess {String}   papers.finalRemark       Final remark after defense
 * @apiSuccess {Date}     papers.lastModified      Last modified time of paper doc
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "papers": [{
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "How to become a millionaire"
 *          "studentId": "56bd1da600a526986cf65c80"
 *          "teacherId": "56bd1da600a526986cf65c80"
 *          "desp": "fuckfuckfuck"
 *          "file": {
 *            "path": "http://localhost:5000/file/1s2d1da600a526986cf85c4f"
 *            "size": 1022392
 *          }
 *          "comments": [{"content": "too bad", "time": 1480155509491}]
 *          "lastModified": 1480155509491
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
 * @apiVersion 0.3.0
 * @apiName GetPaper
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/papers/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   paper                   Paper object
 * @apiSuccess {ObjectId} paper._id               Paper id
 * @apiSuccess {String}   paper.name              Paper name
 * @apiSuccess {String}   paper.studentId         Id of student
 * @apiSuccess {String}   paper.teacherId         Id of student's teacher
 * @apiSuccess {String}   paper.desp              Paper description
 * @apiSuccess {Object[]} paper.scores            Defense scores
 * @apiSuccess {Number[]} paper.scores.items      Each item of teacher's scores
 * @apiSuccess {String}   paper.scores.teacherId  Teacher's id
 * @apiSuccess {Number}   paper.scores.sum        Sum of each teacher's scores
 * @apiSuccess {Boolean}  paper.scores.isLeader   Sum of each teacher's scores
 * @apiSuccess {Object}   paper.file              Paper file
 * @apiSuccess {String}   paper.file.name         Paper file's name
 * @apiSuccess {String}   paper.file.path         Paper file's path
 * @apiSuccess {Number}   paper.file.size         Paper file's size in bytes
 * @apiSuccess {Number}   paper.file.type         Paper file's type
 * @apiSuccess {Date}     paper.file.lastModified Paper file's last modified time
 * @apiSuccess {Object[]} paper.comments          Daily comments of tutor
 * @apiSuccess {String}   paper.comments.content  Content of comment
 * @apiSuccess {Date}     paper.comments.time     Create time of comment
 * @apiSuccess {Number}   paper.finalScore        Final score after defense
 * @apiSuccess {String}   paper.finalRemark       Final remark after defense
 * @apiSuccess {Date}     paper.lastModified      Last modified time of paper doc
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "paper": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "How to become a millionaire"
 *          "studentId": "56bd1da600a526986cf65c80"
 *          "teacherId": "56bd1da600a526986cf65c80"
 *          "desp": "fuckfuckfuck"
 *          "file": {
 *            "path": "http://localhost:5000/file/1s2d1da600a526986cf85c4f"
 *            "size": 1022392
 *          }
 *          "comments": [{"content": "too bad", "time": 1480155509491}]
 *          "lastModified": 1480155509491
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
    logger.error(err.message)
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
 * @apiVersion 0.3.0
 * @apiName UpdatePaper
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "paper": { "name": "How to become a millionaire", "studentId": "56bd1da600a526986cf65c80", "teacherId": "56bd1da600a526986cf65c80", "desp": "fuckfuckfuck"} }' localhost:5000/papers/56bd1da600a526986cf65c80
 *
 * @apiParam {Object}   paper                   Paper object
 * @apiParam {String}   paper.name              Paper name
 * @apiParam {String}   paper.studentId         Id of student
 * @apiParam {String}   paper.teacherId         Id of student's teacher
 * @apiParam {String}   paper.desp              Paper description
 * @apiParam {Object[]} paper.scores            Defense scores
 * @apiParam {Number[]} paper.scores.items      Each item of teacher's scores
 * @apiParam {String}   paper.scores.teacherId  Teacher's id
 * @apiParam {Number}   paper.scores.sum        Sum of each teacher's scores
 * @apiParam {Boolean}  paper.scores.isLeader   Sum of each teacher's scores
 * @apiParam {Object}   paper.file              Paper file
 * @apiParam {String}   paper.file.name         Paper file's name
 * @apiParam {String}   paper.file.path         Paper file's path
 * @apiParam {Number}   paper.file.size         Paper file's size in bytes
 * @apiParam {Number}   paper.file.type         Paper file's type
 * @apiParam {Date}     paper.file.lastModified Paper file's last modified time
 * @apiParam {Object[]} paper.comments          Daily comments of tutor
 * @apiParam {String}   paper.comments.content  Content of comment
 * @apiParam {Date}     paper.comments.time     Create time of comment
 * @apiParam {Number}   paper.finalScore        Final score after defense
 * @apiParam {String}   paper.finalRemark       Final remark after defense
 * @apiParam {Date}     paper.lastModified      Last modified time of paper doc
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
 * @apiVersion 0.3.0
 * @apiName GetMyPaper
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/papers/me
 *
 * @apiSuccess {Object}   paper                   Paper object
 * @apiSuccess {ObjectId} paper._id               Paper id
 * @apiSuccess {String}   paper.name              Paper name
 * @apiSuccess {String}   paper.studentId         Id of student
 * @apiSuccess {String}   paper.teacherId         Id of student's teacher
 * @apiSuccess {String}   paper.desp              Paper description
 * @apiSuccess {Object[]} paper.scores            Defense scores
 * @apiSuccess {Number[]} paper.scores.items      Each item of teacher's scores
 * @apiSuccess {String}   paper.scores.teacherId  Teacher's id
 * @apiSuccess {Number}   paper.scores.sum        Sum of each teacher's scores
 * @apiSuccess {Boolean}  paper.scores.isLeader   Sum of each teacher's scores
 * @apiSuccess {Object}   paper.file              Paper file
 * @apiSuccess {String}   paper.file.name         Paper file's name
 * @apiSuccess {String}   paper.file.path         Paper file's path
 * @apiSuccess {Number}   paper.file.size         Paper file's size in bytes
 * @apiSuccess {Number}   paper.file.type         Paper file's type
 * @apiSuccess {Date}     paper.file.lastModified Paper file's last modified time
 * @apiSuccess {Object[]} paper.comments          Daily comments of tutor
 * @apiSuccess {String}   paper.comments.content  Content of comment
 * @apiSuccess {Date}     paper.comments.time     Create time of comment
 * @apiSuccess {Number}   paper.finalScore        Final score after defense
 * @apiSuccess {String}   paper.finalRemark       Final remark after defense
 * @apiSuccess {Date}     paper.lastModified      Last modified time of paper doc
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "paper": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "How to become a millionaire"
 *          "studentId": "56bd1da600a526986cf65c80"
 *          "teacherId": "56bd1da600a526986cf65c80"
 *          "desp": "fuckfuckfuck"
 *          "file": {
 *            "path": "http://localhost:5000/file/1s2d1da600a526986cf85c4f"
 *            "size": 1022392
 *          }
 *          "comments": [{"content": "too bad", "time": 1480155509491}]
 *          "lastModified": 1480155509491
 *       }
 *     }
 *
 * @apiUse TokenError
 */
export async function getMyPaper(ctx) {
  const id = ctx.state.user._id
  try {
    let paper = await Paper.find({ studentId: id })
    if (!paper) {
      ctx.throw(404)
    }

    ctx.body = {
      paper,
    }
  } catch (err) {
    logger.error(err.message)
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }
}

/**
 * @api {post} /papers/file/56bd1da600a526986cf65c80 Upload paper's file
 * @apiPermission Student
 * @apiVersion 0.3.0
 * @apiName UploadFile
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: multipart/form-data" -X POST -d '{ "paper": {"name": "wbc", "size": 1022392, "lastModified": 1480155509491, "type": "image/png"} }' localhost:5000/papers/file/56bd1da600a526986cf65c80
 *
 * @apiParam   {Object}    paper            File object (required)
 *
 * @apiSuccess {Object}    file             File info object
 * @apiSuccess {String}    file.path        File path
 * @apiSuccess {Number}    file.size        File size
 * @apiSuccess {String}    file.name        File name
 * @apiSuccess {String}    file.type        File type
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "file": {
 *         "path": "http://localhost:5000/file/1s2d1da600a526986cf85c4f"
 *         "size": 1022392
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
export async function uploadFile(ctx) {
  logger.info(ctx.request.files)
  if (ctx.state.user.role !== 'student') {
    ctx.throw(401)
  }
  let paper = ctx.body.paper
  try {
    paper.file = ctx.request.files.paper
    await paper.save()
    ctx.body = {
      file: paper.file,
    }
  } catch (err) {
    logger.error(err.message)
    ctx.throw(422, err.message)
  }
}
