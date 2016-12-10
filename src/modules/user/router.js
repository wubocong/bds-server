import { ensureUser, ensureAdmin } from '../../middleware/validators'
import * as user from './controller'

export const baseUrl = '/users'

export default [
  {
    method: 'POST',
    route: '/teachers',
    handlers: [
      // ensureUser,
      // ensureAdmin,
      user.createTeachers,
    ],
  },
  {
    method: 'POST',
    route: '/students',
    handlers: [
      // ensureUser,
      // ensureAdmin,
      user.createStudents,
    ],
  },
  {
    method: 'POST',
    route: '/admin',
    handlers: [
      // ensureUser,
      // ensureAdmin,
      user.createAdmin,
    ],
  },
  {
    method: 'POST',
    route: '/contactAdmin',
    handlers: [
      user.contactAdmin,
    ],
  },
  {
    method: 'POST',
    route: '/find',
    handlers: [
      // ensureUser,
      // ensureAdmin,
      user.findUser,
    ],
  },
  {
    method: 'POST',
    route: '/',
    handlers: [
      // ensureUser,
      // ensureAdmin,
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
      user.getRole,
    ],
  },
  {
    method: 'PUT',
    route: '/password/:id',
    handlers: [
      ensureUser,
      user.getUser,
      user.modifyPassword,
    ],
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      ensureUser,
      user.getUser,
      user.getRole,
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
      user.getRole,
      user.deleteUser,
    ],
  },
  {
    method: 'DELETE',
    route: '/password/:id',
    handlers: [
      ensureUser,
      user.getUser,
      user.resetPassword,
    ],
  },
]
