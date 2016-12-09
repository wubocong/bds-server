import app from '../bin/server'
import supertest from 'supertest'
import { expect, should } from 'chai'
import { cleanDb } from './utils'

should()
const request = supertest.agent(app.listen())
const context = {}

describe('Users', () => {
  before((done) => {
    cleanDb()
    done()
  })

  describe('POST /users', () => {
    it('should reject user signup when role is incomplete', (done) => {
      request
        .post('/users')
        .set('Accept', 'application/json')
        .send({ account: 'ls1', name: 'ls1' })
        .expect(422, done)
    })

    it('should sign up', (done) => {
      request
        .post('/users')
        .set('Accept', 'application/json')
        .send({ account: 'ls1', name: 'ls1', role: 'admin' })
        .expect(200, (err, res) => {
          if (err) { return done(err) }

          res.body.user.should.have.property('_id')
          res.body.user.should.have.property('role')

          done()
        })
    })

    it('should reject admin signup when password is incomplete', (done) => {
      request
        .post('/users/admin')
        .set('Accept', 'application/json')
        .send({ account: 'gly1', name: 'gly1', role: 'admin' })
        .expect(422, done)
    })

    it('should sign up', (done) => {
      request
        .post('/users/admin')
        .set('Accept', 'application/json')
        .send({ account: 'gly1', name: 'gly1', role: 'admin', password: 'gly1' })
        .expect(200, (err, res) => {
          if (err) { return done(err) }

          res.body.user.should.have.property('_id')

          done()
        })
    })
  })

  describe('GET /users', () => {
    it('should not fetch users if the authorization header is missing', (done) => {
      request
        .get('/users')
        .set('Accept', 'application/json')
        .expect(401, done)
    })

    it('should not fetch users if the authorization header is missing the scheme', (done) => {
      request
        .get('/users')
        .set({
          Accept: 'application/json',
          Authorization: '1',
        })
        .expect(401, done)
    })

    it('should not fetch users if the authorization header has invalid scheme', (done) => {
      const { token } = context
      request
        .get('/users')
        .set({
          Accept: 'application/json',
          Authorization: `Unknown ${token}`,
        })
        .expect(401, done)
    })

    it('should not fetch users if token is invalid', (done) => {
      request
        .get('/users')
        .set({
          Accept: 'application/json',
          Authorization: 'Bearer 1',
        })
        .expect(401, done)
    })

    it('should fetch all users', (done) => {
      const { token } = context
      request
        .get('/users')
        .set({
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        })
        .expect(200, (err, res) => {
          if (err) { return done(err) }

          res.body.should.have.property('users')

          res.body.users.should.have.length(1)

          done()
        })
    })
  })

  describe('GET /users/:id', () => {
    it('should not fetch user if token is invalid', (done) => {
      request
        .get('/users/1')
        .set({
          Accept: 'application/json',
          Authorization: 'Bearer 1',
        })
        .expect(401, done)
    })

    it('should throw 404 if user doesn\'t exist', (done) => {
      const { token } = context
      request
        .get('/users/1')
        .set({
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        })
        .expect(404, done)
    })

    it('should fetch user', (done) => {
      const {
        user: { _id },
        token,
      } = context

      request
        .get(`/users/${_id}`)
        .set({
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        })
        .expect(200, (err, res) => {
          if (err) { return done(err) }

          res.body.should.have.property('user')

          expect(res.body.user.password).to.not.exist

          done()
        })
    })
  })

  describe('PUT /users/:id', () => {
    it('should not update user if token is invalid', (done) => {
      request
        .put('/users/1')
        .set({
          Accept: 'application/json',
          Authorization: 'Bearer 1',
        })
        .expect(401, done)
    })

    it('should throw 404 if user doesn\'t exist', (done) => {
      const { token } = context
      request
        .put('/users/1')
        .set({
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        })
        .expect(404, done)
    })

    it('should update user', (done) => {
      const {
        user: { _id },
        token,
      } = context

      request
        .put(`/users/${_id}`)
        .set({
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        })
        .send({ user: { username: 'updatedcoolname' } })
        .expect(200, (err, res) => {
          if (err) { return done(err) }

          res.body.user.should.have.property('username')
          res.body.user.username.should.equal('updatedcoolname')
          expect(res.body.user.password).to.not.exist

          done()
        })
    })
  })

  describe('DELETE /users/:id', () => {
    it('should not delete user if token is invalid', (done) => {
      request
        .delete('/users/1')
        .set({
          Accept: 'application/json',
          Authorization: 'Bearer 1',
        })
        .expect(401, done)
    })

    it('should throw 404 if user doesn\'t exist', (done) => {
      const { token } = context
      request
        .delete('/users/1')
        .set({
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        })
        .expect(404, done)
    })

    it('should delete user', (done) => {
      const {
        user: { _id },
        token,
      } = context

      request
        .delete(`/users/${_id}`)
        .set({
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        })
        .expect(200, done)
    })
  })
})
