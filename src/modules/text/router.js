import { ensureUser } from '../../middleware/validators'
import * as text from './controller'

export const baseUrl = '/text'

export default [
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      text.getTexts
    ]
  },
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureUser,
      text.createTexts
    ]
  },
  {
    method: 'PUT',
    route: '/',
    handlers: [
      ensureUser,
      text.updateTexts,
    ]
  },
  {
    method: 'DELETE',
    route: '/',
    handlers: [
      ensureUser,
      text.deleteTexts,
    ]
  }
]
