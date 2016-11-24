import { ensureUser } from '../../middleware/validators'
import * as paper from './controller'

export const baseUrl = '/paper'

export default [
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      paper.getPapers,
    ],
  },
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureUser,
      paper.createPapers,
    ],
  },
  {
    method: 'DELETE',
    route: '/',
    handlers: [
      ensureUser,
      paper.deletePapers,
    ],
  },
]
