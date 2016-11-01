import { ensureUser } from '../../middleware/validators'
import * as file from './controller'

export const baseUrl = '/file'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureUser,
      file.createFiles
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      file.getFiles
    ]
  },
  {
    method: 'POST',
    route: '/tag/',
    handlers: [
      ensureUser,
      file.getQueryFiles
    ]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      ensureUser,
      file.getFile
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      ensureUser,
      file.getFile,
      file.deleteFile
    ]
  }
]
