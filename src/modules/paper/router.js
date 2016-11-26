import { ensureUser, ensureAdmin } from '../../middleware/validators'
import * as paper from './controller'

export const baseUrl = '/papers'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureUser,
      paper.createPaper,
    ],
  },
  {
    method: 'GET',
    route: '/me',
    handlers: [
      ensureUser,
      paper.getMyPaper,
    ],
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      ensureAdmin,
      paper.getPapers,
    ],
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      ensureUser,
      ensureAdmin,
      paper.getPaper,
    ],
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      ensureUser,
      paper.getPaper,
      paper.updatePaper,
    ],
  },
]
