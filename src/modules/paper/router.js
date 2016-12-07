import { ensureUser, ensureAdmin } from '../../middleware/validators'
import * as paper from './controller'

export const baseUrl = '/papers'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      ensureUser,
      paper.createPaper,
    ],
  },
  {
    method: 'GET',
    route: '/me',
    handlers: [
      ensureUser,
      paper.getMyPaper,
    ],
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      ensureUser,
      // ensureAdmin,
      paper.getPapers,
    ],
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [
      ensureUser,
      // ensureAdmin,
      paper.getPaper,
    ],
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      ensureUser,
      // ensureAdmin,
      paper.getPaper,
      paper.updatePaper,
    ],
  },
  {
    method: 'PUT',
    route: '/basic/:id',
    handlers: [
      ensureUser,
      // ensureAdmin,
      paper.getPaper,
      paper.updatePaperBasic,
    ],
  },
  {
    method: 'PUT',
    route: '/score/:id',
    handlers: [
      ensureUser,
      paper.getPaper,
      paper.updatePaperScore,
    ],
  },
  {
    method: 'PUT',
    route: '/final/:id',
    handlers: [
      ensureUser,
      paper.getPaper,
      paper.updatePaperFinalInfo,
    ],
  },
  {
    method: 'GET',
    route: '/final/:id',
    handlers: [
      ensureUser,
      paper.getPaper,
      paper.getPaperFinalInfo,
    ],
  },
  {
    method: 'PUT',
    route: '/comment/:id',
    handlers: [
      ensureUser,
      paper.getPaper,
      paper.updatePaperComment,
    ],
  },
  {
    method: 'POST',
    route: '/file/:id',
    handlers: [
      ensureUser,
      paper.getPaper,
      paper.uploadFile,
    ],
  },
]
