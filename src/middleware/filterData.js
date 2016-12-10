const logger = require('koa-log4').getLogger('index')

export async function filterData(ctx, next) {
  logger.info(ctx.request)
  ctx.request.body = null
  const methods = ['get', 'post', 'put', 'delete']
  const method = ctx.method.toLowerCase()
  if (!methods.includes(method)) {
    ctx.throw(405, 'Method Not Allowed')
    logger.error(url + 'filter method')
  }
  if (method === 'get') {
    ctx.request.fields = ctx.request.files = null
    return next()
  }

  const {defense, defenses, paper, user, users, comment, score, file, account, password, role, oldPassword, newPassword, studentIds, defenseIds, finalScore, remark} = ctx.request.fields
  const url = ctx.url
  const roles = ['teacher', 'student', 'admin']
  if (url.search(/^\/auth/) >= 0) {
    if (!roles.includes(role) || (typeof account !== 'string') || (typeof password !== 'string')) {
      ctx.throw(401, 'Unauthorized(filtered)')
      logger.error(url + "filter auth's value")
    }
  } else if (url.search(/^\/users/) >= 0) {
    if (url.search(/modifyPassword/) >= 0) {
      if (user || users || typeof oldPassword !== 'string' || typeof newPassword !== 'string' || !roles.includes(role)) {
        ctx.throw(422, 'Unprocessable Entity(filtered)')
        logger.error(url + "filter user's value")
      }
    } else if ((user && users) || (user && typeof user !== 'object') || (users && !Array.isArray(users))) {
      ctx.throw(422, 'Unprocessable Entity(filtered)')
      logger.error(url + "filter user's value")
    }
  } else if (url.search(/^\/defenses/) >= 0) {
    if ((defenseIds && !Array.isArray(defenseIds)) || (studentIds && !Array.isArray(studentIds)) || (defenses && !Array.isArray(defenses)) || (defense && typeof defense !== 'object')) {
      ctx.throw(422, 'Unprocessable Entity(filtered)')
      logger.error(url + "filter defense's value")
    }
  } else if (url.search(/^\/papers/) >= 0) {
    if ((file && typeof file !== 'object') || (score && typeof score !== 'object') || (paper && typeof paper !== 'object') || (comment && typeof comment !== 'object') || (finalScore && !Number.isInteger(finalScore)) || (remark && typeof remark !== 'string')) {
      ctx.throw(422, 'Unprocessable Entity(filtered)')
      logger.error(url + "filter paper's value")
    }
  }
  return next()
}
