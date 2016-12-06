import * as auth from './controller'
import { getRole } from '../user/controller'

export const baseUrl = '/auth'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      auth.authUser,
      getRole,
    ],
  },
]
