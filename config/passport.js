import passport from 'koa-passport'
import Teacher from '../models/teachers'
import Student from '../models/students'
import Admin from '../models/admins'
import { Strategy } from 'passport-local'

// hack
import { lookup } from '../node_modules/passport-local/lib/utils.js'
Strategy.prototype.authenticate = function (req, options) {
  options = options || {}
  const username = lookup(req.fields, this._usernameField)
  const password = lookup(req.fields, this._passwordField)

  if (!username || !password) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400)
  }

  const verified = (err, user, info) => {
    if (err) { return this.error(err) }
    if (!user) { return this.fail(info) }
    this.success(user, info)
  }

  try {
    if (this._passReqToCallback) {
      this._verify(req, username, password, verified)
    } else {
      this._verify(username, password, verified)
    }
  } catch (ex) {
    return this.error(ex)
  }
}

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id, '-password')
    done(null, user)
  } catch (err) {
    done(err)
  }
})

passport.use('teacher', new Strategy({
  usernameField: 'number',
  passwordField: 'password'
}, async (number, password, done) => {
  try {
    const teacher = await Teacher.findOne({ number })
    if (!teacher) { return done(null, false) }

    try {
      const isMatch = await teacher.validatePassword(password)

      if (!isMatch) { return done(null, false) }

      done(null, teacher)
    } catch (err) {
      done(err)
    }
  } catch (err) {
    return done(err)
  }
}))

passport.use('admin', new Strategy({
  usernameField: 'number',
  passwordField: 'password'
}, async (number, password, done) => {
  try {
    const admin = await Admin.findOne({ number })
    if (!admin) { return done(null, false) }

    try {
      const isMatch = await admin.validatePassword(password)

      if (!isMatch) { return done(null, false) }

      done(null, admin)
    } catch (err) {
      done(err)
    }
  } catch (err) {
    return done(err)
  }
}))

passport.use('student', new Strategy({
  usernameField: 'number',
  passwordField: 'password'
}, async (number, password, done) => {
  try {
    const student = await Student.findOne({ number })
    if (!student) { return done(null, false) }

    try {
      const isMatch = await student.validatePassword(password)

      if (!isMatch) { return done(null, false) }

      done(null, student)
    } catch (err) {
      done(err)
    }
  } catch (err) {
    return done(err)
  }
}))
