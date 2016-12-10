import Paper from '../../models/papers'
import Student from '../../models/students'
import Teacher from '../../models/teachers'
import Defense from '../../models/defenses'
const logger = require('koa-log4').getLogger('index')
/**
 * @api {post} /papers Create a paper
 * @apiPermission Admin
 * @apiVersion 0.4.5
 * @apiName CreatePaper
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "paper": { "name": "How to become a millionaire", "studentId": "56bd1da600a526986cf65c80", "teacherId": "56bd1da600a526986cf65c80", "desp": "fuckfuckfuck", "scores": [{"teacherId": "56bd1da600a526986cf65c80", "isLeader": true, "sum": 100, "items": { "defenseScore": 80,  "innovationScore": 80,  "descriptionScore": 80,  "resultScore": 80,  "qualityScore": 80,  "designScore": 80,  "pointScore": 80,  "topicScore": 80 }}], "remark": "bad guy", "time": 1479891536874 }]} }' localhost:5000/papers
 *
 * @apiParam {Object}   paper                                  Paper object (required)
 * @apiParam {String}   paper.name                             Paper name (required)
 * @apiParam {ObjectId} paper.studentId                        Id of student (required)
 * @apiParam {ObjectId} paper.teacherId                        Id of student's teacher (required)
 * @apiParam {String}   paper.desp                             Paper description (required)
 * @apiParam {Object[]} paper.scores                           Defense scores
 * @apiParam {Number[]} paper.scores.items                     Each item of teacher's scores
 * @apiParam {Number}   paper.scores.items.defenseScore        defenseScore
 * @apiParam {Number}   paper.scores.items.innovationScore     innovationScore
 * @apiParam {Number}   paper.scores.items.descriptionScore    descriptionScore
 * @apiParam {Number}   paper.scores.items.resultScore         resultScore
 * @apiParam {Number}   paper.scores.items.qualityScore        qualityScore
 * @apiParam {Number}   paper.scores.items.designScore         designScore
 * @apiParam {Number}   paper.scores.items.pointScore          pointScore
 * @apiParam {Number}   paper.scores.items.topicScore          topicScore
 * @apiParam {Object}   paper.scores.teacher                   Judge teacher's object
 * @apiParam {ObjectId} paper.scores.teacher._id               Id of the judge teacher
 * @apiParam {String}   paper.scores.teacher.name              Name of the judge teacher
 * @apiParam {Number}   paper.scores.sum                       Sum of each teacher's scores
 * @apiParam {Boolean}  paper.scores.isLeader                  Whether the teacher is leader
 * @apiParam {Object}   paper.file                             Paper file
 * @apiParam {String}   paper.file.name                        Paper file's name
 * @apiParam {String}   paper.file.path                        Paper file's path
 * @apiParam {Number}   paper.file.size                        Paper file's size in bytes
 * @apiParam {Number}   paper.file.type                        Paper file's type
 * @apiParam {Date}     paper.file.lastModified                Paper file's last modified time
 * @apiParam {Object[]} paper.comments                         Daily comments of tutor
 * @apiParam {String}   paper.comments.content                 Content of comment
 * @apiParam {Date}     paper.comments.time                    Create time of comment
 * @apiParam {Number}   paper.finalScore                       Final score after defense
 * @apiParam {String}   paper.remark                           Remark after defense
 * @apiParam {Date}     paper.lastModified                     Last modified time of paper doc
 *
 * @apiSuccess {Object}     paper            Paper Object
 * @apiSuccess {ObjectId}   paper._id        Paper id
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "paper": {
 *         "id": "56bd1da600a526986cf65c80"
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
export async function createPaper(ctx) {
  let paper = {
    studentId: ctx.state.user._id,
    teacherId: ctx.state.role.teacherId,
    ...ctx.request.fields.paper,
    fileSize: 0,
    filePath: '',
  }
  try {
    paper = new Paper(paper)
    await paper.save()
    ctx.body = {
      paper: {
        _id: paper._id,
      },
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422, err.message)
  }
  // let student
  // let teacher
  try {
    await Promise.all([
      Student.findOneAndUpdate({
        studentId: paper.studentId,
      }, {
        $set: {
          paperId: paper._id,
        },
      }, {
        safe: true,
        upsert: true,
      }),
      Teacher.findOneAndUpdate({
        teacherId: paper.teacherId,
      }, {
        $addToSet: {
          paperIds: paper._id,
          studentIds: paper.studentId,
        },
      }, {
        safe: true,
        upsert: true,
      }),
    ]).then((roles) => {
      // [student, teacher] = roles
    })
  } catch (err) {
    logger.error(err)
    try {
      await Promise.all([paper.remove && paper.remove()])
    // await Promise.all([paper.remove && paper.remove(), student.remove && student.remove(), teacher.remove && teacher.remove()])
    } catch (err) {
      ctx.throw(500, err.message)
      logger.error(err)
    }
    ctx.throw(401, err.message)
  }
}

/**
 * @api {get} /papers Get all paper
 * @apiPermission SuperAdmin
 * @apiVersion 0.4.5
 * @apiName GetPapers
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/papers
 *
 * @apiSuccess {Object[]} papers                   Paper objects
 * @apiSuccess {ObjectId} papers._id               Paper id
 * @apiSuccess {String}   papers.name              Paper name
 * @apiSuccess {ObjectId} papers.studentId         Id of student
 * @apiSuccess {ObjectId} papers.teacherId         Id of student's teacher
 * @apiSuccess {String}   papers.desp              Paper description
 * @apiSuccess {Object[]} papers.scores            Defense scores
 * @apiSuccess {Number[]} papers.scores.items      Each item of teacher's scores
 * @apiSuccess {Number}   papers.scores.items.defenseScore       defenseScore
 * @apiSuccess {Number}   papers.scores.items.innovationScore    innovationScore
 * @apiSuccess {Number}   papers.scores.items.descriptionScore   descriptionScore
 * @apiSuccess {Number}   papers.scores.items.resultScore        resultScore
 * @apiSuccess {Number}   papers.scores.items.qualityScore       qualityScore
 * @apiSuccess {Number}   papers.scores.items.designScore        designScore
 * @apiSuccess {Number}   papers.scores.items.pointScore         pointScore
 * @apiSuccess {Number}   papers.scores.items.topicScore         topicScore
 * @apiSuccess {Object}   paper.scores.teacher                   Judge teacher's object
 * @apiSuccess {ObjectId} paper.scores.teacher._id               Id of the judge teacher
 * @apiSuccess {String}   paper.scores.teacher.name              Name of the judge teacher
 * @apiSuccess {Number}   papers.scores.sum        Sum of each teacher's scores
 * @apiSuccess {Boolean}  papers.scores.isLeader   Whether the teacher is leader
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
 * @apiSuccess {String}   papers.remark            Remark after defense
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
  try {
    const papers = await Paper.find()
    if (!papers) {
      throw new Error('404')
    }
    ctx.body = {
      papers,
    }
  } catch (err) {
    logger.error(err)
    if (err.message === '404' || err.name === 'CastError') {
      ctx.throw(404, 'Not Found')
    }

    ctx.throw(500, err.message)
  }
}

/**
 * @api {get} /papers/:id Get a paper by id
 * @apiPermission SuperAdmin
 * @apiVersion 0.4.5
 * @apiName GetPaper
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/papers/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   paper                                 Paper object
 * @apiSuccess {ObjectId} paper._id                             Paper id
 * @apiSuccess {String}   paper.name                            Paper name
 * @apiSuccess {ObjectId} paper.studentId                       Id of student
 * @apiSuccess {ObjectId} paper.teacherId                       Id of student's teacher
 * @apiSuccess {String}   paper.desp                            Paper description
 * @apiSuccess {Object[]} paper.scores                          Defense scores
 * @apiSuccess {Number[]} paper.scores.items                    Each item of teacher's scores
 * @apiSuccess {Number}   paper.scores.items.defenseScore       defenseScore
 * @apiSuccess {Number}   paper.scores.items.innovationScore    innovationScore
 * @apiSuccess {Number}   paper.scores.items.descriptionScore   descriptionScore
 * @apiSuccess {Number}   paper.scores.items.resultScore        resultScore
 * @apiSuccess {Number}   paper.scores.items.qualityScore       qualityScore
 * @apiSuccess {Number}   paper.scores.items.designScore        designScore
 * @apiSuccess {Number}   paper.scores.items.pointScore         pointScore
 * @apiSuccess {Number}   paper.scores.items.topicScore         topicScore
 * @apiSuccess {Object}   paper.scores.teacher                   Judge teacher's object
 * @apiSuccess {ObjectId} paper.scores.teacher._id               Id of the judge teacher
 * @apiSuccess {String}   paper.scores.teacher.name              Name of the judge teacher
 * @apiSuccess {Number}   paper.scores.sum                      Sum of each teacher's scores
 * @apiSuccess {Boolean}  paper.scores.isLeader                 Whether the teacher is leader
 * @apiSuccess {Object}   paper.file                            Paper file
 * @apiSuccess {String}   paper.file.name                       Paper file's name
 * @apiSuccess {String}   paper.file.path                       Paper file's path
 * @apiSuccess {Number}   paper.file.size                       Paper file's size in bytes
 * @apiSuccess {Number}   paper.file.type                       Paper file's type
 * @apiSuccess {Date}     paper.file.lastModified               Paper file's last modified time
 * @apiSuccess {Object[]} paper.comments                        Daily comments of tutor
 * @apiSuccess {String}   paper.comments.content                Content of comment
 * @apiSuccess {Date}     paper.comments.time                   Create time of comment
 * @apiSuccess {Number}   paper.finalScore                      Final score after defense
 * @apiSuccess {String}   paper.remark                          Remark after defense
 * @apiSuccess {Date}     paper.lastModified                    Last modified time of paper doc
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
      throw new Error(404)
    }
    ctx.body = {
      paper,
    }
  } catch (err) {
    logger.error(err)
    if (err.message === '404' || err.name === 'CastError') {
      ctx.throw(404, 'Not Found')
    }

    ctx.throw(500, err.message)
  }

  if (next) {
    return next()
  }
}

/**
 * @api {put} /papers/:id Update a paper by id
 * @apiPermission SuperAdmin
 * @apiVersion 0.4.5
 * @apiName UpdatePaper
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "paper": { "name": "How to become a millionaire", "studentId": "56bd1da600a526986cf65c80", "teacherId": "56bd1da600a526986cf65c80", "desp": "fuckfuckfuck", "scores": [{"teacherId": "56bd1da600a526986cf65c80", "isLeader": true, "sum": 100, "items": { "defenseScore": 80,  "innovationScore": 80,  "descriptionScore": 80,  "resultScore": 80,  "qualityScore": 80,  "designScore": 80,  "pointScore": 80,  "topicScore": 80 }}], "remark": "bad guy", "time": 1479891536874 }]} }' localhost:5000/papers/56bd1da600a526986cf65c80
 *
 * @apiParam {Object}   paper                   Paper object
 * @apiParam {String}   paper.name              Paper name
 * @apiParam {ObjectId} paper.studentId         Id of student
 * @apiParam {ObjectId} paper.teacherId         Id of student's teacher
 * @apiParam {String}   paper.desp              Paper description
 * @apiParam {Object[]} paper.scores            Defense scores
 * @apiParam {Number[]} paper.scores.items      Each item of teacher's scores
 * @apiParam {Number}   paper.scores.items.defenseScore        defenseScore
 * @apiParam {Number}   paper.scores.items.innovationScore     innovationScore
 * @apiParam {Number}   paper.scores.items.descriptionScore    descriptionScore
 * @apiParam {Number}   paper.scores.items.resultScore         resultScore
 * @apiParam {Number}   paper.scores.items.qualityScore        qualityScore
 * @apiParam {Number}   paper.scores.items.designScore         designScore
 * @apiParam {Number}   paper.scores.items.pointScore          pointScore
 * @apiParam {Number}   paper.scores.items.topicScore          topicScore
 * @apiParam {Object}   paper.scores.teacher                   Judge teacher's object
 * @apiParam {ObjectId} paper.scores.teacher._id               Id of the judge teacher
 * @apiParam {String}   paper.scores.teacher.name              Name of the judge teacher
 * @apiParam {Number}   paper.scores.sum        Sum of each teacher's scores
 * @apiParam {Boolean}  paper.scores.isLeader   Whether the teacher is leader
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
 * @apiParam {String}   paper.remark            Remark after defense
 * @apiParam {Date}     paper.lastModified      Last modified time of paper doc
 *
 * @apiSuccess {Boolean}   update     Action status
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
 * @apiVersion 0.4.5
 * @apiName GetMyPaper
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/papers/me
 *
 * @apiSuccess {Object}   paper                   Paper object
 * @apiSuccess {ObjectId} paper._id               Paper id
 * @apiSuccess {String}   paper.name              Paper name
 * @apiSuccess {ObjectId} paper.studentId         Id of student
 * @apiSuccess {ObjectId} paper.teacherId         Id of student's teacher
 * @apiSuccess {String}   paper.desp              Paper description
 * @apiSuccess {Object[]} paper.scores            Defense scores
 * @apiSuccess {Number[]} paper.scores.items      Each item of teacher's scores
 * @apiSuccess {Object}   paper.scores.teacher                   Judge teacher's object
 * @apiSuccess {ObjectId} paper.scores.teacher._id               Id of the judge teacher
 * @apiSuccess {String}   paper.scores.teacher.name              Name of the judge teacher
 * @apiSuccess {Number}   paper.scores.sum        Sum of each teacher's scores
 * @apiSuccess {Boolean}  paper.scores.isLeader   Whether the teacher is leader
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
 * @apiSuccess {String}   paper.remark            Remark after defense
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
    const paper = await Paper.find({
      studentId: id,
    })
    if (!paper) {
      ctx.throw(404, 'Not Found')
    }
    ctx.body = {
      paper,
    }
  } catch (err) {
    logger.error(err)
    if (err.message === '404' || err.name === 'CastError') {
      ctx.throw(404, 'Not Found')
    }

    ctx.throw(500, err.message)
  }
}

/**
 * @api {post} /papers/file/56bd1da600a526986cf65c80 Upload a paper's file by id
 * @apiPermission Student
 * @apiVersion 0.4.5
 * @apiName UploadFile
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: multipart/form-data" -X POST -d '{ "file": new File() }' localhost:5000/papers/file/56bd1da600a526986cf65c80
 *
 * @apiParam   {File}      file        File object (required)
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
    ctx.throw(401, 'Only Students Allowed')
  }
  let paper = ctx.body.paper
  try {
    paper.file = ctx.request.files.paper
    await paper.save()
    ctx.body = {
      file: paper.file,
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422, err.message)
  }
}

/**
 * @api {put} /papers/score/:id Update a paper's score by id
 * @apiPermission Teacher(judge)
 * @apiVersion 0.4.5
 * @apiName UpdatePaperScore
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "score": { "sum": 80, "items": { "defenseScore": 80,  "innovationScore": 80,  "descriptionScore": 80,  "resultScore": 80,  "qualityScore": 80,  "designScore": 80,  "pointScore": 80,  "topicScore": 80 } } }' localhost:5000/papers/score/56bd1da600a526986cf65c80
 *
 * @apiParam   {Object}     score                           A teacher's score (required)
 * @apiParam   {Number}     score.sum                       Sum of scores (required)
 * @apiParam   {Object[]}   score.items                     Each item of score (required)
 * @apiParam   {Number}     score.items.defenseScore        defenseScore
 * @apiParam   {Number}     score.items.innovationScore     innovationScore
 * @apiParam   {Number}     score.items.descriptionScore    descriptionScore
 * @apiParam   {Number}     score.items.resultScore         resultScore
 * @apiParam   {Number}     score.items.qualityScore        qualityScore
 * @apiParam   {Number}     score.items.designScore         designScore
 * @apiParam   {Number}     score.items.pointScore          pointScore
 * @apiParam   {Number}     score.items.topicScore          topicScore
 *
 * @apiSuccess {Boolean}   updatePaperScore     Action status
 *
 * @apiSuccess {String}    remark                          Automatic generated remark of a paper
 * @apiSuccess {Number}    finalScore                      Final score for normal judge, average score for leader
 * @apiSuccess {Object[]}  scores                          Defense scores
 * @apiSuccess {Number}    sum                             Sum of each teacher's scores
 * @apiSuccess {Object}    scores.teacher                  Judge teacher's object
 * @apiSuccess {ObjectId}  scores.teacher._id              Id of the judge teacher
 * @apiSuccess {String}    scores.teacher.name             Name of the judge teacher
 * @apiSuccess {Number[]}  scores.items                    Each item of teacher's scores
 * @apiSuccess {Number}    scores.items.defenseScore       defenseScore
 * @apiSuccess {Number}    scores.items.innovationScore    innovationScore
 * @apiSuccess {Number}    scores.items.descriptionScore   descriptionScore
 * @apiSuccess {Number}    scores.items.resultScore        resultScore
 * @apiSuccess {Number}    scores.items.qualityScore       qualityScore
 * @apiSuccess {Number}    scores.items.designScore        designScore
 * @apiSuccess {Number}    scores.items.pointScore         pointScore
 * @apiSuccess {Number}    scores.items.topicScore         topicScore
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "updatePaperScore": true
 *     }
 *
 * @apiSuccessExample {json} Success-Response(leader get when other teachers have finished):
 *     HTTP/1.1 200 OK
 *     {
 *       "finalScore": 80
 *       "remark": "this is a pig"
 *       "scores": [{
 *         "sum": 80
 *         "teacher": {
 *           "_id": "56bd1da600a526986cf65c80"
 *           "name": "7day"
 *         }
 *         "items": {
 *           "defenseScore": 80
 *           "innovationScore": 80
 *           "descriptionScore": 80
 *           "resultScore": 80
 *           "qualityScore": 80
 *           "designScore": 80
 *           "pointScore": 80
 *           "topicScore": 80
 *         }
 *       } {
 *         "sum": 80
 *         "teacher": {
 *           "_id": "56bd1da600a526986cf65c80"
 *           "name": "7day"
 *         }
 *         "items": {
 *           "defenseScore": 80
 *           "innovationScore": 80
 *           "descriptionScore": 80
 *           "resultScore": 80
 *           "qualityScore": 80
 *           "designScore": 80
 *           "pointScore": 80
 *           "topicScore": 80
 *         }
 *       } {
 *         "sum": 80
 *         "teacher": {
 *           "_id": "56bd1da600a526986cf65c80"
 *           "name": "7day"
 *         }
 *         "items": {
 *           "defenseScore": 80
 *           "innovationScore": 80
 *           "descriptionScore": 80
 *           "resultScore": 80
 *           "qualityScore": 80
 *           "designScore": 80
 *           "pointScore": 80
 *           "topicScore": 80
 *         }
 *       }]
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

export async function updatePaperScore(ctx) {
  let {scores, defenseId} = ctx.body.paper
  let teacherId = ctx.state.user._id.toString()
  let isLeader
  let defense
  try {
    defense = await Defense.findById(defenseId)
  } catch (err) {
    ctx.throw(500, "Can't get defense from paper")
  }
  try {
    if (scores.length === 3) {
      throw new Error('All Scores Given')
    }
    scores.forEach((score, i) => {
      if (score.teacher._id) {
        if (score.teacher._id.toString() == teacherId) {
          throw new Error('Repeated Score Forbidden')
        }
      } else if (i === 1 && scores.length === 1) {
        scores.shift()
      }
    })
    const {teacherIds, leaderId} = defense
    if (!teacherIds.some(id => id == teacherId)) {
      throw new Error('Authorized Teachers Only')
    }
    isLeader = leaderId ? teacherId == leaderId.toString() : false
    scores.push({
      teacher: {
        _id: teacherId,
        name: ctx.state.user.name,
      },
      isLeader,
      items: ctx.request.fields.score.items,
      sum: ctx.request.fields.score.sum,
    })
  } catch (err) {
    logger.error(err)
    ctx.throw(401, err.message)
  }
  try {
    if (scores.length === 3 && isLeader) {
      ctx.body.paper.remark = 'fake remark'
      const finalScore = scores.reduce((pre, cur) => pre + cur.sum, 0) / 3
      await ctx.body.paper.save()
      ctx.body = {
        finalScore,
        remark: ctx.body.paper.remark,
        scores: scores,
      }
    } else {
      ctx.body.paper.scores = scores
      await ctx.body.paper.save()

      ctx.body = {
        updatePaperScore: true,
      }
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422, err.message)
  }
}

/**
 * @api {get} /papers/final/:id Get a paper's final info by id
 * @apiPermission Teacher
 * @apiVersion 0.4.5
 * @apiName GetPaperFinalInfo
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/papers/final/56bd1da600a526986cf65c80
 *
 * @apiSuccess {String}    remark                          Automatic generated remark of a paper
 * @apiSuccess {Number}    finalScore                      Final score for normal judge, average score for leader
 * @apiSuccess {Object[]}  scores                          Defense scores
 * @apiSuccess {Number}    scores.sum                      Sum of each teacher's scores
 * @apiSuccess {Object}    scores.teacher                  Judge teacher's object
 * @apiSuccess {ObjectId}  scores.teacher._id              Id of the judge teacher
 * @apiSuccess {String}    scores.teacher.name             Name of the judge teacher
 * @apiSuccess {Number[]}  scores.items                    Each item of teacher's scores
 * @apiSuccess {Number}    scores.items.defenseScore       defenseScore
 * @apiSuccess {Number}    scores.items.innovationScore    innovationScore
 * @apiSuccess {Number}    scores.items.descriptionScore   descriptionScore
 * @apiSuccess {Number}    scores.items.resultScore        resultScore
 * @apiSuccess {Number}    scores.items.qualityScore       qualityScore
 * @apiSuccess {Number}    scores.items.designScore        designScore
 * @apiSuccess {Number}    scores.items.pointScore         pointScore
 * @apiSuccess {Number}    scores.items.topicScore         topicScore
 *
 * @apiSuccess {Boolean}   waiting              Waiting signal
 *
 * @apiSuccessExample {json} Final info(normal teacher) Temporary info(leader):
 *     HTTP/1.1 200 OK
 *     {
 *       "finalScore": 80
 *       "remark": "this is a pig"
 *       "scores": [{
 *         "sum": 80
 *         "teacher": {
 *           "_id": "56bd1da600a526986cf65c80"
 *           "name": "7day"
 *         }
 *         "items": {
 *           "defenseScore": 80
 *           "innovationScore": 80
 *           "descriptionScore": 80
 *           "resultScore": 80
 *           "qualityScore": 80
 *           "designScore": 80
 *           "pointScore": 80
 *           "topicScore": 80
 *         }
 *       } {
 *         "sum": 80
 *         "teacher": {
 *           "_id": "56bd1da600a526986cf65c80"
 *           "name": "7day"
 *         }
 *         "items": {
 *           "defenseScore": 80
 *           "innovationScore": 80
 *           "descriptionScore": 80
 *           "resultScore": 80
 *           "qualityScore": 80
 *           "designScore": 80
 *           "pointScore": 80
 *           "topicScore": 80
 *         }
 *       } {
 *         "sum": 80
 *         "teacher": {
 *           "_id": "56bd1da600a526986cf65c80"
 *           "name": "7day"
 *         }
 *         "items": {
 *           "defenseScore": 80
 *           "innovationScore": 80
 *           "descriptionScore": 80
 *           "resultScore": 80
 *           "qualityScore": 80
 *           "designScore": 80
 *           "pointScore": 80
 *           "topicScore": 80
 *         }
 *       }]
 *     }
 *
 * @apiSuccessExample {json} Waiting(final score not given or scores not all given):
 *     HTTP/1.1 200 OK
 *     {
 *       "waiting": true
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

export async function getPaperFinalInfo(ctx) {
  const {defenseId, finalScore, remark, scores} = ctx.body.paper
  let defense
  try {
    defense = await Defense.findById(defenseId)
  } catch (err) {
    ctx.throw(500, "Can't get defense from paper")
  }
  const {teacherIds, leaderId} = defense
  const teacherId = ctx.state.user._id.toString()
  const isLeader = leaderId.toString() == teacherId
  try {
    if (!teacherIds.some(id => id == teacherId)) {
      throw new Error('Leader Only')
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(401, err.message)
  }
  try {
    if (!isLeader) {
      if (finalScore !== 0) {
        ctx.body = {
          finalScore: finalScore,
          remark: remark,
          scores: scores,
        }
      } else {
        ctx.body = {
          waiting: true,
        }
      }
    } else {
      if (scores.length === 3) {
        ctx.body.paper.remark = 'fake remark'
        await ctx.body.paper.save()

        const finalScore = scores.reduce((pre, cur) => pre + cur.sum, 0) / 3
        ctx.body = {
          finalScore,
          remark: remark,
          scores: scores,
        }
      } else {
        ctx.body = {
          waiting: true,
        }
      }
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422, err.message)
  }
}

/**
 * @api {put} /papers/final/:id Update a paper's final info by id
 * @apiPermission Teacher(leader)
 * @apiVersion 0.4.5
 * @apiName UpdatePaperFinalInfo
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "paper": {"finalScore": 100, "remark": "FUCKFUCKFUCK"} }' localhost:5000/papers/final/56bd1da600a526986cf65c80
 *
 * @apiParam {Object}   paper               Paper object(required)
 * @apiParam {String}   paper.finalScore    Paper's final score
 * @apiParam {String}   paper.remark        Paper's remark
 *
 * @apiSuccess {Boolean}   updatePaperFinalScore     Action status
 * @apiSuccess {Boolean}   defenseOver               Return true when the defense is over
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "updatePaperFinalInfo": true
 *     }
 *
 * @apiSuccessExample {json} Defense finished:
 *     HTTP/1.1 200 OK
 *     {
 *       "defenseOver": true
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

export async function updatePaperFinalInfo(ctx) {
  const paper = ctx.body.paper
  const defense = await Defense.findById(paper.defenseId)
  let {finished, leaderId, paperIds, status} = defense
  const teacherId = ctx.state.user._id.toString()
  const isLeader = leaderId.toString() == teacherId
  try {
    if (!isLeader || parseInt(paper.finalScore)) {
      throw new Error('Leader Only')
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(401, err.message)
  }
  try {
    paper.finalScore = ctx.request.fields.paper.finalScore || paper.finalScore
    paper.remark = ctx.request.fields.paper.remark || paper.remark
    if (++finished === paperIds.length && status === 1) {
      status = 2
    }
    Object.assign(defense, {
      finished,
      status,
    })

    await Promise.all([paper.save(), defense.save()])

    ctx.body = {
      updatePaperFinalInfo: true,
    }
    if (status >= 2) {
      ctx.body = {
        defenseOver: true,
      }
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(422, err.message)
  }
}

/**
 * @api {put} /papers/comment/:id Update a paper's comment by id
 * @apiPermission Teacher(tutor)
 * @apiVersion 0.4.5
 * @apiName UpdatePaperComment
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "comment": {"content": "phy biu", "time": 1479891536874} }' localhost:5000/papers/comment/56bd1da600a526986cf65c80
 *
 * @apiParam {Object}   comment            Student tutor's comment (required)
 * @apiParam {ObjectId} comment.id         Comment id (required)
 * @apiParam {String}   comment.content    Comment content (required)
 * @apiParam {Date}     comment.time       Comment time
 *
 * @apiSuccess {Boolean}   updatePaperComment     Action status
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "updatePaperComment": true
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

export async function updatePaperComment(ctx) {
  const paper = ctx.body.paper
  try {
    if (paper.teacherId.toString() != ctx.state.user._id) {
      throw new Error('Tutor Only')
    }
  } catch (err) {
    logger.error(err)
    ctx.throw(401, err.message)
  }
  try {
    const comments = paper.toJSON().comments
    let overflow = comments.length < 3 && true
    const newComment = {
      content: ctx.request.fields.comment.content,
      time: new Date().getTime(),
      id: comments.length,
    }
    comments.some((comment, id) => {
      if (comment.id === ctx.request.fields.comment.id) {
        newComment.id = id
        comments[id] = newComment
        overflow = false
        return true
      }
    })
    if (overflow) {
      comments.push(newComment)
    }
    paper.comments = comments

    await paper.save()
  } catch (err) {
    logger.error(err)
    ctx.throw(422, err.message)
  }

  ctx.body = {
    updatePaperComment: true,
  }
}

/**
 * @api {put} /papers/basic/:id Update a paper's basic info by id
 * @apiPermission Admin
 * @apiVersion 0.4.5
 * @apiName UpdatePaperBasic
 * @apiGroup Papers
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "paper": { "name": "How to become a millionaire", "studentId": "56bd1da600a526986cf65c80", "teacherId": "56bd1da600a526986cf65c80", "desp": "fuckfuckfuck" } }' localhost:5000/papers/basic/56bd1da600a526986cf65c80
 *
 * @apiParam {Object}   paper                   Paper object (required)
 * @apiParam {String}   paper.name              Paper name
 * @apiParam {String}   paper.studentId         Id of student
 * @apiParam {String}   paper.teacherId         Id of student's teacher
 * @apiParam {String}   paper.desp              Paper description
 *
 * @apiSuccess {Boolean}   updatePaperBasic     Action status
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "updatePaperBasic": true
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

export async function updatePaperBasic(ctx) {
  try {
    const paper = ctx.body.paper
    const {name, studentId, teacherId, desp} = ctx.request.fields.paper
    const newPaper = {
      name: name || paper.name,
      studentId: studentId || paper.studentId,
      teacherId: teacherId || paper.teacherId,
      desp: desp || paper.desp,
    }
    Object.assign(paper, newPaper)
    await paper.save()

    ctx.body = {
      updatePaperBasic: true,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}
