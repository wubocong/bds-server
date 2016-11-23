import * as auth from './controller'

export const baseUrl = '/auth'

export default [
  {
    method: 'POST',
    route: '/teacher',
    handlers: [
      auth.authTeacher,
    ]
  },
  {
    method: 'POST',
    route: '/admin',
    handlers: [
      auth.authAdmin,
    ]
  },
  {
    method: 'POST',
    route: '/student',
    handlers: [
      auth.authStudent,
    ]
  },
]
