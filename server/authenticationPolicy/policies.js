const jwt = require('jsonwebtoken')
const config = require('../config/config')
const cookieparser = require('cookieparser')

module.exports = {
  validateT(req, res, next) {
    try {
      let token = null
      if (req.headers.cookie) {
        var parsed = cookieparser.parse(req.headers.cookie)
        token = parsed.tokenT
      }

      jwt.verify(token, config.authentication.jwtSecret)
      next()
    } catch (e) {
      req.session.teacher = null
      req.session.Ttoken = null
      return res.status(401).send({
        error: 'Auth failed'
      })
    }

  },

  validateS(req, res, next) {
    try {
      let token = null
      if (req.headers.cookie) {
        var parsed = cookieparser.parse(req.headers.cookie)
        token = parsed.tokenS
      }

      jwt.verify(token, config.authentication.jwtSecret)
      next()
    } catch (e) {
      req.session.student = null
      req.session.Stoken = null
      return res.status(401).send({
        error: 'Auth failed'
      })
    }

  },

  validateA(req, res, next) {
    try {
      let token = null
      if (req.headers.cookie) {
        var parsed = cookieparser.parse(req.headers.cookie)
        token = parsed.tokenA
      }
      
      jwt.verify(token, config.authentication.jwtSecret)
      next()
    } catch (e) {
      console.log('there was error here');
      
      req.session.admin = null
      req.session.Atoken = null;
      return res.status(401).send({
        error: 'Auth failed'
      })
    }

  },

}
