import User from '../models/users'
import Student from '../models/students'
import Teacher from '../models/teachers'
import Admin from '../models/admins'

import config from '../../config'
import { getToken } from '../utils/auth'
import { verify } from 'jsonwebtoken'
const logger = require('koa-log4').getLogger('index')

export async function ensureUser (ctx, next) {
  const token = getToken(ctx)

  if (!token) {
    ctx.throw(401, 'Token Missed')
  }

  let decoded
  try {
    decoded = verify(token, config.token)
  } catch (err) {
    logger.error(err)
    ctx.throw(401, err.message)
  }
  let user
  try {
    user = await User.findById(decoded.id, '-password')
  } catch (err) {
    ctx.throw(500, err.message)
  }
  let role
  try {
    switch (user.role) {
      case 'student':
        {
          role = await Student.findOne({studentId: decoded.id}, '-studentId')
          break
        }
      case 'teacher':
        {
          role = await Teacher.findOne({teacherId: decoded.id}, '-teacherId')
          break
        }
      case 'admin':
        {
          role = await Admin.findOne({adminId: decoded.id}, '-adminId')
          break
        }
      default:
        break
    }
  } catch (err) {
    logger.error(err)
    if (err.message === '404' || err.name === 'CastError') {
      ctx.throw(404, 'Not Found')
    }

    ctx.throw(500, err.message)
  }
  ctx.state.user = user
  ctx.state.role = role
  return next()
}

export async function ensureAdmin (ctx, next) {
  if (ctx.state.user.role !== 'admin') {
    ctx.throw(403, 'Admin Only')
  }
  return next()
}
