import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../../config'
import jwt from 'jsonwebtoken'

const Admin = new mongoose.Schema({
  type: { type: String, default: 'Admin' },
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

Admin.pre('save', function preSave (next) {
  const admin = this

  if (!admin.isModified('password')) {
    return next()
  }

  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return reject(err) }
      resolve(salt)
    })
  })
    .then(salt => {
      bcrypt.hash(admin.password, salt, (err, hash) => {
        if (err) { throw new Error(err) }

        admin.password = hash

        next(null)
      })
    })
    .catch(err => next(err))
})

Admin.methods.validatePassword = function validatePassword (password) {
  const admin = this

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err) { return reject(err) }

      resolve(isMatch)
    })
  })
}

Admin.methods.generateToken = function generateToken () {
  const admin = this

  return jwt.sign({ id: admin.id }, config.token)
}

export default mongoose.model('admin', Admin)
