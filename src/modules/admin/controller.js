import Admin from '../../models/admins'

/**
 * @api {post} /admins Create a new admin
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName CreateAdmin
 * @apiGroup Admins
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "admin": { "adminname": "johndoe", "password": "secretpasas" } }' localhost:5000/admins
 *
 * @apiParam {Object} admin          Admin object (required)
 * @apiParam {String} admin.adminname Adminname.
 * @apiParam {String} admin.password Password.
 *
 * @apiSuccess {Object}   admins           Admin object
 * @apiSuccess {ObjectId} admins._id       Admin id
 * @apiSuccess {String}   admins.name      Admin name
 * @apiSuccess {String}   admins.adminname  Admin adminname
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "admin": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "adminname": "johndoe"
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
export async function createAdmin (ctx) {
  const admin = new Admin(ctx.request.fields.admin)
  try {
    await admin.save()
  } catch (err) {
    ctx.throw(422, err.message)
  }

  const token = admin.generateToken()
  const response = admin.toJSON()

  delete response.password

  ctx.body = {
    admin: response,
    token
  }
}

/**
 * @api {get} /admins Get all admins
 * @apiPermission admin
 * @apiVersion 1.0.0
 * @apiName GetAdmins
 * @apiGroup Admins
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/admins
 *
 * @apiSuccess {Object[]} admins           Array of admin objects
 * @apiSuccess {ObjectId} admins._id       Admin id
 * @apiSuccess {String}   admins.name      Admin name
 * @apiSuccess {String}   admins.adminname  Admin adminname
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "admins": [{
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "adminname": "johndoe"
 *       }]
 *     }
 *
 * @apiUse TokenError
 */
export async function getAdmins (ctx) {
  const admins = await Admin.find({}, '-password')
  ctx.body = { admins }
}

/**
 * @api {get} /admins/:id Get admin by id
 * @apiPermission admin
 * @apiVersion 1.0.0
 * @apiName GetAdmin
 * @apiGroup Admins
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/admins/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   admins           Admin object
 * @apiSuccess {ObjectId} admins._id       Admin id
 * @apiSuccess {String}   admins.name      Admin name
 * @apiSuccess {String}   admins.adminname  Admin adminname
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "admin": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "adminname": "johndoe"
 *       }
 *     }
 *
 * @apiUse TokenError
 */
export async function getAdmin (ctx, next) {
  try {
    const admin = await Admin.findById(ctx.params.id, '-password')
    if (!admin) {
      ctx.throw(404)
    }

    ctx.body = {
      admin
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
 * @api {put} /admins/:id Update a admin
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName UpdateAdmin
 * @apiGroup Admins
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "admin": { "name": "Cool new Name" } }' localhost:5000/admins/56bd1da600a526986cf65c80
 *
 * @apiParam {Object} admin          Admin object (required)
 * @apiParam {String} admin.name     Name.
 * @apiParam {String} admin.adminname Adminname.
 *
 * @apiSuccess {Object}   admins           Admin object
 * @apiSuccess {ObjectId} admins._id       Admin id
 * @apiSuccess {String}   admins.name      Updated name
 * @apiSuccess {String}   admins.adminname  Updated adminname
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "admin": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "Cool new name"
 *          "adminname": "johndoe"
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
export async function updateAdmin (ctx) {
  const admin = ctx.body.admin

  Object.assign(admin, ctx.request.fields.admin)

  await admin.save()

  ctx.body = {
    admin
  }
}

/**
 * @api {delete} /admins/:id Delete a admin
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName DeleteAdmin
 * @apiGroup Admins
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X DELETE localhost:5000/admins/56bd1da600a526986cf65c80
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

export async function deleteAdmin (ctx) {
  const admin = ctx.body.admin

  await admin.remove()

  ctx.status = 200
  ctx.body = {
    success: true
  }
}
