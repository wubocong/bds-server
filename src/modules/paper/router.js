import { ensureStudent } from '../../middleware/validators'
import * as file from './controller'

export const baseUrl = '/file'

export default [
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureStudent,
      file.getPapers
    ]
  },
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureStudent,
      file.createPapers
    ]
  },
  {
    method: 'DELETE',
    route: '/',
    handlers: [
      ensureStudent,
      file.deletePapers,
    ]
  }
]
