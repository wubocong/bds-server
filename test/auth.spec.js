import app from '../bin/server'
import supertest from 'supertest'
import { expect, should } from 'chai'
import { cleanDb, authUser } from './utils'

should()
const request = supertest.agent(app.listen())
const context = {}

describe('Auth', () => {
  before((done) => {
    cleanDb()
    authUser(request, (err, { user, token }) => {
      if (err) { return done(err) }

      context.user = user
      context.token = token
      done()
    })
  })

  describe('POST /auth', () => {
    it('should throw 401 if credentials are incorrect', (done) => {
      request
        .post('/auth')
        .set('Accept', 'application/json')
        .send({ account: 'phy', password: 'phyispig', role: 'student' })
        .expect(401, done)
    })

    it('should throw 401 if role is missed', (done) => {
      request
        .post('/auth')
        .set('Accept', 'application/json')
        .send({ account: 'phy', password: 'phy' })
        .expect(401, done)
    })

    it('should auth student', (done) => {
      request
        .post('/auth')
        .set('Accept', 'application/json')
        .send({ account: 'phy', password: 'phy' })
        .expect(200, (err, res) => {
          if (err) { return done(err) }

          res.body.user.should.have.property('_id')
          res.body.user.should.have.property('name')
          res.body.user.should.have.property('account')
          res.body.user.should.have.property('role')
          res.body.user.should.have.property('studentId')
          res.body.user.should.have.property('grade')
          res.body.user.should.have.property('major')
          res.body.user.should.have.property('clazz')
          res.body.user.name.should.equal('phy')
          res.body.user.account.should.equal('phy')
          res.body.user.role.should.equal('student')
          expect(res.body.user.password).to.not.exist

          context.student.user = res.body.user
          context.student.token = res.body.token

          done()
        })
    })

    it('should auth admin', (done) => {
      request
        .post('/auth')
        .set('Accept', 'application/json')
        .send({ account: 'gly', password: 'gly' })
        .expect(200, (err, res) => {
          if (err) { return done(err) }

          res.body.user.should.have.property('_id')
          res.body.user.should.have.property('name')
          res.body.user.should.have.property('account')
          res.body.user.should.have.property('role')
          res.body.user.name.should.equal('gly')
          res.body.user.account.should.equal('gly')
          res.body.user.role.should.equal('admin')
          expect(res.body.user.password).to.not.exist

          context.admin.user = res.body.user
          context.admin.token = res.body.token

          done()
        })
    })

    it('should auth teacher', (done) => {
      request
        .post('/auth')
        .set('Accept', 'application/json')
        .send({ account: 'ls', password: 'ls' })
        .expect(200, (err, res) => {
          if (err) { return done(err) }

          res.body.user.should.have.property('_id')
          res.body.user.should.have.property('name')
          res.body.user.should.have.property('account')
          res.body.user.should.have.property('role')
          res.body.user.name.should.equal('ls')
          res.body.user.account.should.equal('ls')
          res.body.user.role.should.equal('teacher')
          expect(res.body.user.password).to.not.exist

          context.teacher.user = res.body.user
          context.teacher.token = res.body.token

          done()
        })
    })
  })
})
