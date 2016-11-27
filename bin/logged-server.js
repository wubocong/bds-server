import log4js from 'koa-log4'
import path from 'path'
import app from './server'
import config from '../config'

log4js.configure(path.resolve(__dirname, '..', 'log4js.json'))

const logger = log4js.getLogger('startup')

/**
 * Event listener for HTTP app "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const port = config.port
  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP app "listening" event.
 */

function onListening () {
  const addr = app.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  logger.info('Listening on ' + bind)
}

app.on('error', onError)
app.on('listening', onListening)

export default app
