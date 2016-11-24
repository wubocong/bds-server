import Teacher from '../models/teachers'
import Student from '../models/students'
import Admin from '../models/admins'
import config from '../../config'
import { getToken } from '../utils/auth'
import { verify } from 'jsonwebtoken'

export async function ensureTeacher (ctx, next) {
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

  ctx.state.teacher = await Teacher.findById(decoded.id, '-password')
  if (!ctx.state.teacher) {
    ctx.throw(401)
  }

  return next()
}

export async function ensureStudent (ctx, next) {
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

  ctx.state.student = await Student.findById(decoded.id, '-password')
  if (!ctx.state.student) {
    ctx.throw(401)
  }

  return next()
}

export async function ensureAdmin (ctx, next) {
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

  ctx.state.admin = await Admin.findById(decoded.id, '-password')
  if (!ctx.state.admin) {
    ctx.throw(401)
  }

  return next()
}
