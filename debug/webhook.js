const http = require('http')
const exec = require('child_process').exec

const server = http.createServer((req, res) => {
  if (req.url.search(/webhook\/?$/i) > 0) {
    exec('git pull --all && pm2 restart index && pm2 restart webhook')
    res.writeHead(200)
    res.write('pig')
    res.end()
  } else {
    res.writeHead(404)
    res.end()
  }
})

server.listen(3000, '0.0.0.0')
