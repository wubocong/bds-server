import mongoose from 'mongoose'

export function cleanDb () {
  for (const collection in mongoose.connection.collections) {
    if (mongoose.connection.collections.hasOwnProperty(collection)) {
      mongoose.connection.collections[collection].remove()
    }
  }
}

export function authUser (agent, callback) {
  agent
    .post('/auth')
    .set('Accept', 'application/json')
    .send({ account: 'gly', password: 'gly', role: 'admin' })
    .end((err, res) => {
      if (err) { return callback(err) }

      callback(null, {
        user: res.body.user,
        token: res.body.token,
      })
    })
}
