import Koa from 'koa'
import body from 'koa-better-body'
import convert from 'koa-convert'
// import logger from 'koa-logger'
import mongoose from 'mongoose'
import session from 'koa-generic-session'
import MongoStore from 'koa-generic-session-mongo'
import passport from 'koa-passport'
import mount from 'koa-mount'
import serve from 'koa-static'
import cors from 'koa-cors'
import log4js from 'koa-log4'

import config from '../config'
import {
  errorMiddleware,
} from '../src/middleware'

log4js.configure(`${process.cwd()}/log4js.json`, { cwd: `${process.cwd()}/logs` })
const logger = log4js.getLogger('app')
const app = new Koa()
app.keys = [config.session]

mongoose.Promise = global.Promise
mongoose.connect(config.database)

app.use(convert(cors()))

app.use(log4js.koaLogger(log4js.getLogger('http'), { level: 'auto' }))
// app.use(convert(logger()))
app.use(convert(body({
  uploadDir: `${process.cwd()}/upload_files`,
  strict: false,
})))
app.use(convert(session({
  store: new MongoStore(),
})))
app.use(errorMiddleware())

app.use(convert(mount('/docs', serve(`${process.cwd()}/docs`))))

require('../config/passport')
app.use(passport.initialize())
app.use(passport.session())

const modules = require('../src/modules')
modules(app)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.listen(config.port, () => {
  console.log(`Server started on ${config.port}`)
})

export default app
