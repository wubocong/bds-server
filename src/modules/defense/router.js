import { ensureUser } from '../../middleware/validators'
import * as defense from './controller'

export const baseUrl = '/defense'

export default [
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      defense.getDefenses,
    ],
  },
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureUser,
      defense.createDefenses,
    ],
  },
  {
    method: 'PUT',
    route: '/',
    handlers: [
      ensureUser,
      defense.updateDefenses,
    ],
  },
  {
    method: 'DELETE',
    route: '/',
    handlers: [
      ensureUser,
      defense.deleteDefenses,
    ],
  },
]
