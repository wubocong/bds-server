import { ensureStudent } from '../../middleware/validators'
import * as student from './controller'

export const baseUrl = '/students'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      student.createStudent
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureStudent,
      student.getStudents
    ]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      ensureStudent,
      student.getStudent
    ]
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      ensureStudent,
      student.getStudent,
      student.updateStudent
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      ensureStudent,
      student.getStudent,
      student.deleteStudent
    ]
  }
]
