const logger = require('koa-log4').getLogger('index')
export function errorMiddleware () {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      logger.error(ctx.url + ' ' + err.message)
      ctx.status = err.status || 500
      ctx.body = err.message
      ctx.app.emit('error', err, ctx)
    }
  }
}
