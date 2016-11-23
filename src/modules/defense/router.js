import { ensureAdmin } from '../../middleware/validators'
import * as defense from './controller'

export const baseUrl = '/defense'

export default [
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureAdmin,
      defense.getDefenses
    ]
  },
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureAdmin,
      defense.createDefenses
    ]
  },
  {
    method: 'PUT',
    route: '/',
    handlers: [
      ensureAdmin,
      defense.updateDefenses,
    ]
  },
  {
    method: 'DELETE',
    route: '/',
    handlers: [
      ensureAdmin,
      defense.deleteDefenses,
    ]
  }
]
