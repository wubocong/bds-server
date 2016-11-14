import { ensureUser } from '../../middleware/validators'
import * as tag from './controller'

export const baseUrl = '/tag'

export default [
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      tag.getTags
    ]
  },
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureUser,
      tag.getTags,
      tag.duplicateTags,
      tag.createTags
    ]
  },
  {
    method: 'PUT',
    route: '/',
    handlers: [
      ensureUser,
      tag.getTags,
      tag.updateTags,
    ]
  },
  {
    method: 'DELETE',
    route: '/',
    handlers: [
      ensureUser,
      tag.getTags,
      tag.deleteTags,
    ]
  }
]
