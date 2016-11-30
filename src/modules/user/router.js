import { ensureUser, ensureAdmin } from '../../middleware/validators'
import * as user from './controller'

export const baseUrl = '/users'

export default [
  {
    method: 'POST',
    route: '/contactAdmin',
    handlers: [
      user.contactAdmin,
    ],
  },
  {
    method: 'POST',
    route: '/',
    handlers: [
      user.createUser,
    ],
  },
  {
    method: 'GET',
    route: '/me/',
    handlers: [
      ensureUser,
      user.getMe,
    ],
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      // ensureAdmin,
      user.getUsers,
    ],
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      ensureUser,
      // ensureAdmin,
      user.getUser,
    ],
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      ensureUser,
      user.getUser,
      user.updateUser,
    ],
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      ensureUser,
      // ensureAdmin,
      user.getUser,
      user.deleteUser,
    ],
  },
  {
    method: 'PUT',
    route: '/password/:id',
    handlers: [
      ensureUser,
      user.modifyPassword,
    ],
  },
]
