
const logger = require('koa-log4').getLogger('index')

export async function filterData(ctx, next) {
  if (ctx.method.toLowerCase() === 'get') {
    ctx.request.fields = ctx.request.files = null
  }
  let {defense, defenses, paper, papers, user, comment, score} = ctx.request.fields
  if (user) {


  }
  return next()
}