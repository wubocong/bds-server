import { ensureTeacher } from '../../middleware/validators'
import * as teacher from './controller'

export const baseUrl = '/teachers'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      teacher.createTeacher,
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureTeacher,
      teacher.getTeachers,
    ]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      ensureTeacher,
      teacher.getTeacher,
    ]
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      ensureTeacher,
      teacher.getTeacher,
      teacher.updateTeacher,
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      ensureTeacher,
      teacher.getTeacher,
      teacher.deleteTeacher,
    ]
  }
]
