import { ensureUser, ensureAdmin } from '../../middleware/validators'
import * as defense from './controller'

export const baseUrl = '/defenses'

export default [
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      ensureUser,
      defense.getMyDefense,
    ],
  },
  {
    method: 'GET',
    route: '/detail/:id',
    handlers: [
      ensureUser,
      defense.getDefenseDetail,
    ],
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      // ensureAdmin,
      defense.getDefenses,
    ],
  },
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureUser,
      // ensureAdmin,
      defense.createDefenses,
    ],
  },
  {
    method: 'PUT',
    route: '/',
    handlers: [
      ensureUser,
      // ensureAdmin,
      defense.updateDefenses,
    ],
  },
  {
    method: 'DELETE',
    route: '/',
    handlers: [
      ensureUser,
      // ensureAdmin,
      defense.deleteDefenses,
    ],
  },
]
