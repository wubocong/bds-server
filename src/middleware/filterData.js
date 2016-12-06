const logger = require('koa-log4').getLogger('index')

export async function filterData(ctx, next) {
  ctx.request.body = null
  if (ctx.method.toLowerCase() === 'get') {
    ctx.request.fields = ctx.request.files = null
    return next()
  }
  let {defense, defenses, paper, user, users, comment, score, file, account, password, role, oldPassword, newPassword, studentIds, defenseIds} = ctx.request.fields
  const roles = ['teacher', 'student', 'admin']
  if (ctx.url.search(/^\/auth/) >= 0) {
    if (!roles.includes(role) || (typeof account !== 'string') || (typeof password !== 'string')) {
      ctx.thorw(401, 'Unauthorized(filtered)')
      logger.warn("filter auth's value")
    }
  }
  if (ctx.url.search(/^\/users/) >= 0) {
    if (ctx.url.search(/modifyPassword/) >= 0) {
      if (user || users || typeof oldPassword !== 'string' || typeof newPassword !== 'string' || !roles.includes(role)) {
        ctx.thorw(422, 'Unprocessable Entity(filtered)')
        logger.warn("filter user's value")
      }
    } else if ((user && users) || typeof user !== 'object' || !Array.isArray(users)) {
      ctx.thorw(422, 'Unprocessable Entity(filtered)')
      logger.warn("filter user's value")
    }
  }
  if (ctx.url.search(/^\/defenses/) >= 0) {
    if (!Array.isArray(defenseIds) || !Array.isArray(studentIds) || !Array.isArray(defenses) || typeof defense !== 'object') {
      ctx.thorw(422, 'Unprocessable Entity(filtered)')
      logger.warn("filter defense's value")
    }
  }
  if (ctx.url.search(/^\/papers/) >= 0) {
    if (typeof file !== 'object' || typeof score !== 'object' || typeof paper !== 'object' || typeof comment !== 'object') {
      ctx.thorw(422, 'Unprocessable Entity(filtered)')
      logger.warn("filter defense's value")
    }
  }
  return next()
}
