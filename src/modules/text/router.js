import { ensureUser } from '../../middleware/validators'
import * as text from './controller'

export const baseUrl = '/text'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureUser,
      text.createText
    ]
  },
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
    route: '/tag/',
    handlers: [
      ensureUser,
      text.getQueryTexts
    ]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      // ensureUser,
      text.getText
    ]
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      ensureUser,
      text.getText,
      text.updateText
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      // ensureUser,
      text.getText,
      text.deleteText
    ]
  }
]
