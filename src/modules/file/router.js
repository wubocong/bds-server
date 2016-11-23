import { ensureUser } from '../../middleware/validators'
import * as file from './controller'

export const baseUrl = '/file'

export default [
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
    route: '/',
    handlers: [
      ensureUser,
      file.createFiles
    ]
  },
  {
    method: 'DELETE',
    route: '/',
    handlers: [
      ensureUser,
      file.deleteFiles,
    ]
  }
]
