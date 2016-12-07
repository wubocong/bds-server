import glob from 'glob'
import Router from 'koa-router'
import { filterData } from '../middleware/filterData'
const logger = require('koa-log4').getLogger('index')

exports = module.exports = function initModules (app) {
  glob(`${__dirname}/*`, { ignore: '**/index.js' }, (err, matches) => {
    if (err) {
      logger.error(err)
      throw err
    }

    matches.forEach((mod) => {
      const router = require(`${mod}/router`)

      const routes = router.default
      const baseUrl = router.baseUrl
      const instance = new Router({ prefix: baseUrl })

      routes.forEach((config) => {
        const {
          method = '',
          route = '',
          handlers = [],
        } = config

        const lastHandler = handlers.pop()
        try {
          instance[method.toLowerCase()](route, filterData, ...handlers, async ctx => await lastHandler(ctx))
        } catch (err) {
          logger.error('modules/index.js ' + err.message)
        }
        app
          .use(instance.routes())
          .use(instance.allowedMethods())
      })
    })
  })
}
