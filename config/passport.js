import passport from 'koa-passport'
import User from '../src/models/users'
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

passport.use('local', new Strategy({
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, done) => {
  try {
    const user = await User.findOne({ account })
    if (!user) { return done(null, false) }

    try {
      const isMatch = await user.validatePassword(password)

      if (!isMatch) { return done(null, false) }

      done(null, user)
    } catch (err) {
      done(err)
    }
  } catch (err) {
    return done(err)
  }
}))
