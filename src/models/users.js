import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../../config'
import jwt from 'jsonwebtoken'

const User = new mongoose.Schema({
  type: { type: String, default: 'User' },
  name: { type: String, required: true },
  account: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  gender: { type: Boolean, required: true, default: true },
  university: { type: String, required: true, default: 'scau' },
  school: { type: String, required: true, default: '软件学院' },
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  address: { type: String },
  avatar: { type: String },
})

User.pre('save', function preSave(next) {
  const user = this

  if (!user.isModified('password')) {
    return next()
  }

  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return reject(err) }
      resolve(salt)
    })
  })
    .then(salt => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) { throw new Error(err) }

        user.password = hash

        next(null)
      })
    })
    .catch(err => next(err))
})

User.methods.validatePassword = function validatePassword(password) {
  const user = this
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) { return reject(err) }

      resolve(isMatch)
    })
  })
}

User.methods.generateToken = function generateToken() {
  const user = this

  return jwt.sign({ id: user.id }, config.token, {
    expiresIn: '10h',
  })
}

export default mongoose.model('user', User)
