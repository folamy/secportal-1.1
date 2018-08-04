const path = require('path')
const mongoose = require('mongoose')
const models = require('../models/schemas')(mongoose)

module.exports = {
  //get current
   host: process.env.HOST || '127.0.0.1',
   port: process.env.PORT || 3000,
  db: {
    database: process.env.DB_NAME || 'SecPortal',
    user: process.env.DB_USER || 'Admin',
    pwd: process.env.DB_PASS || 'OUTlook11',
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'badAss'
  }
}
