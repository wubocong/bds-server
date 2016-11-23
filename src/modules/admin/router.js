import { ensureAdmin } from '../../middleware/validators'
import * as admin from './controller'

export const baseUrl = '/admins'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      admin.createAdmin
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureAdmin,
      admin.getAdmins
    ]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      ensureAdmin,
      admin.getAdmin
    ]
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      ensureAdmin,
      admin.getAdmin,
      admin.updateAdmin
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      ensureAdmin,
      admin.getAdmin,
      admin.deleteAdmin
    ]
  }
]
