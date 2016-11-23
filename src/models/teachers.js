import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../../config'
import jwt from 'jsonwebtoken'

const Teacher = new mongoose.Schema({
  type: { type: String, default: 'Teacher' },
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

Teacher.pre('save', function preSave (next) {
  const teacher = this

  if (!teacher.isModified('password')) {
    return next()
  }

  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return reject(err) }
      resolve(salt)
    })
  })
    .then(salt => {
      bcrypt.hash(teacher.password, salt, (err, hash) => {
        if (err) { throw new Error(err) }

        teacher.password = hash

        next(null)
      })
    })
    .catch(err => next(err))
})

Teacher.methods.validatePassword = function validatePassword (password) {
  const teacher = this

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, teacher.password, (err, isMatch) => {
      if (err) { return reject(err) }

      resolve(isMatch)
    })
  })
}

Teacher.methods.generateToken = function generateToken () {
  const teacher = this

  return jwt.sign({ id: teacher.id }, config.token)
}

export default mongoose.model('teacher', Teacher)
