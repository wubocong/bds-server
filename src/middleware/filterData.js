const logger = require('koa-log4').getLogger('index')

export async function filterData(ctx, next) {
  ctx.request.body = null
  if (ctx.method.toLowerCase() === 'get') {
    ctx.request.fields = ctx.request.files = null
    return next()
  }
  const {defense, defenses, paper, user, users, comment, score, file, account, password, role, oldPassword, newPassword, studentIds, defenseIds} = ctx.request.fields
  const url = ctx.url
  const roles = ['teacher', 'student', 'admin']
  if (url.search(/^\/auth/) >= 0) {
    if (!roles.includes(role) || (typeof account !== 'string') || (typeof password !== 'string')) {
      ctx.throw(401, 'Unauthorized(filtered)')
      logger.warn(url + "filter auth's value")
    }
  } else
  if (url.search(/^\/users/) >= 0) {
    if (url.search(/modifyPassword/) >= 0) {
      if (user || users || typeof oldPassword !== 'string' || typeof newPassword !== 'string' || !roles.includes(role)) {
        ctx.throw(422, 'Unprocessable Entity(filtered)')
        logger.warn(url + "filter user's value")
      }
    } else if ((user && users) || (user && typeof user !== 'object') || (users && !Array.isArray(users))) {
      ctx.throw(422, 'Unprocessable Entity(filtered)')
      logger.warn(url + "filter user's value")
    }
  } else
  if (url.search(/^\/defenses/) >= 0) {
    if ((defenseIds && !Array.isArray(defenseIds)) || (studentIds && !Array.isArray(studentIds)) || (defenses && !Array.isArray(defenses)) || (defense && typeof defense !== 'object')) {
      ctx.throw(422, 'Unprocessable Entity(filtered)')
      logger.warn(url + "filter defense's value")
    }
  } else
  if (url.search(/^\/papers/) >= 0) {
    if ((file && typeof file !== 'object') || (score && typeof score !== 'object') || (paper && typeof paper !== 'object') || (comment && typeof comment !== 'object')) {
      ctx.throw(422, 'Unprocessable Entity(filtered)')
      logger.warn(url + "filter defense's value")
    }
  }
  return next()
}
