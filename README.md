#koa2-api-boilerplate
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

Boilerplate for building APIs with [koa2](https://github.com/koajs/koa/tree/v2.x) and mongodb.

This project covers basic necessities of most APIs.
* Authentication (passport & jwt)
* Database (mongoose)
* Testing (mocha)
* Doc generation with apidoc
* linting using standard

##Requirements
* node __^6.0.0__
* npm __^3.0.0__

##Installation
```bash
git clone https://github.com/adrianObel/koa2-api-boilerplate.git
```

##Features
* [koa2](https://github.com/koajs/koa/tree/v2.x)
* [koa-router](https://github.com/alexmingoia/koa-router)
* [koa-bodyparser](https://github.com/koajs/bodyparser)
* [koa-generic-session](https://github.com/koajs/generic-session)
* [koa-logger](https://github.com/koajs/logger)
* [MongoDB](http://mongodb.org/)
* [Mongoose](http://mongoosejs.com/)
* [Passport](http://passportjs.org/)
* [Nodemon](http://nodemon.io/)
* [Mocha](https://mochajs.org/)
* [apidoc](http://apidocjs.com/)
* [Babel](https://github.com/babel/babel)
* [ESLint](http://eslint.org/)

##Structure
```
├── bin
│   └── server.js            # Bootstrapping and entry point
├── config                   # Server configuration settings
│   ├── env                  # Environment specific config
│   │   ├── common.js
│   │   ├── development.js
│   │   ├── production.js
│   │   └── test.js
│   ├── index.js             # Config entrypoint - exports config according to envionrment and commons
│   └── passport.js          # Passportjs config of strategies
├── src                      # Source code
│   ├── modules
│   │   ├── controller.js    # Module-specific controllers
│   │   └── router.js        # Router definitions for module
│   ├── models               # Mongoose models
│   └── middleware           # Custom middleware
│       └── validators       # Validation middleware
└── test                     # Unit tests
```

##Usage
* `npm start` Start server on live mode
* `npm run dev` Start server on dev mode with nodemon
* `npm run docs` Generate API documentation
* `npm test` Run mocha tests

##Documentation
API documentation is written inline and generated by [apidoc](http://apidocjs.com/).

Visit `http://localhost:5000/docs/` to view docs

##License
MIT

## Test

```js
{
  "user": {
    "__v": 0,
    "username": "wubocong",
    "_id": "57e9475474784916d81840d8",
    "type": "User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3ZTk0NzU0NzQ3ODQ5MTZkODE4NDBkOCIsImlhdCI6MTQ3NDkwNTk0MH0.fT6Hq-ZQankMaC_kcwrtgNXgshjAO-zjACSlO779w7Q"
}
```