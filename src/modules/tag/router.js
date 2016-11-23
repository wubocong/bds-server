import * as tag from './controller'

export const baseUrl = '/tag'

export default [
  {
    method: 'GET',
    route: '/',
    handlers: [
      tag.getTags,
    ]
  },
  {
    method: 'POST',
    route: '/',
    handlers: [
      tag.getTags,
      tag.duplicateTags,
      tag.createTags,
    ]
  },
  {
    method: 'PUT',
    route: '/',
    handlers: [
      tag.getTags,
      tag.updateTags,
    ]
  },
  {
    method: 'DELETE',
    route: '/',
    handlers: [
      tag.getTags,
      tag.deleteTags,
    ]
  }
]
