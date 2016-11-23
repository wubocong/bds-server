import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../../config'
import jwt from 'jsonwebtoken'

const Student = new mongoose.Schema({
  type: { type: String, default: 'Student' },
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

Student.pre('save', function preSave (next) {
  const student = this

  if (!student.isModified('password')) {
    return next()
  }

  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return reject(err) }
      resolve(salt)
    })
  })
    .then(salt => {
      bcrypt.hash(student.password, salt, (err, hash) => {
        if (err) { throw new Error(err) }

        student.password = hash

        next(null)
      })
    })
    .catch(err => next(err))
})

Student.methods.validatePassword = function validatePassword (password) {
  const student = this

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, student.password, (err, isMatch) => {
      if (err) { return reject(err) }

      resolve(isMatch)
    })
  })
}

Student.methods.generateToken = function generateToken () {
  const student = this

  return jwt.sign({ id: student.id }, config.token)
}

export default mongoose.model('student', Student)
