const http = require('http')
const exec = require('child_process').exec

const server = http.createServer((req, res) => {
  if (req.url.search(/reset\/?$/i) > 0) {
    exec('npm run restore', (err, success) => {
      if (err) {
        res.writeHead(500)
        res.write('fuck')
      } else {
        res.writeHead(200)
        res.write('restore!')
      }
      res.end()
    })
  } else if (req.url.search(/webhook\/?$/i) > 0) {
    exec('git pull --all && pm2 restart index && pm2 restart webhook', (err, success) => {
      if (err) {
        res.writeHead(500)
        res.write('fuck')
      } else {
        res.writeHead(200)
        res.write('hook!')
      }
      res.end()
    })
  } else {
    res.writeHead(404)
    res.end()
  }
})

server.listen(3000, '0.0.0.0')
