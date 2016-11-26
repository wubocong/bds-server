import User from '../models/users'
import Student from '../models/students'
import Teacher from '../models/teachers'
import Admin from '../models/admins'

import config from '../../config'
import { getToken } from '../utils/auth'
import { verify } from 'jsonwebtoken'

export async function ensureUser (ctx, next) {
  const token = getToken(ctx)

  if (!token) {
    ctx.throw(401)
  }

  let decoded = null
  try {
    decoded = verify(token, config.token)
  } catch (err) {
    ctx.throw(401)
  }

  const user = await User.findById(decoded.id, '-password')
  const id = user._id.toString()

  try {
    switch (user.role) {
      case 'student':
        {
          Object.assign(user, await Student.find({studentId: id}, '-studentId'))
          break
        }
      case 'teacher':
        {
          Object.assign(user, await Teacher.find({teacherId: id}, '-teacherId'))
          break
        }
      case 'admin':
        {
          Object.assign(user, await Admin.find({adminId: id}, '-adminId'))
          break
        }
      default:
        break
    }
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }
  ctx.state.user = user
  if (!ctx.state.user) {
    ctx.throw(401)
  }
  return next()
}

export async function ensureAdmin (ctx, next) {
  if (ctx.state.user.role !== 'admin') {
    ctx.throw(401)
  }
  return next()
}

export async function ensureSelf (ctx, next) {
  if (ctx.state.user._id.toString() !== ctx.params.id) {
    ctx.throw(401)
  }
  return next()
}
