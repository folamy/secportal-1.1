
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const { Nuxt, Builder } = require('nuxt')
const fileUpload = require('express-fileupload');
// const {sequelize} = require('./models')
const conn = require('./config/config')

const app = express()
const host = conn.host
const port = conn.port
// const api =
app.use(morgan('dev'))
app.use(bodyParser.json())

app.use(cors())
app.use(session({
  secret: 'our-love-is-our-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge:  60 * 60 * 1000 }
}))
app.use(fileUpload())
app.use(express.static(path.join(__dirname, '.../static')))

app.set('port', conn.port)
app.set('host', conn.host)
require('./api/teachers')(app)
require('./api/router')(app)
require('./api/admin')(app)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  const mongoose = require('mongoose');
  mongoose.Promise = require('bluebird');
  mongoose.connect('mongodb://localhost/SecPortal', { promiseLibrary: require('bluebird') })
    .then(() =>  {
        console.log('connection succesful')
        app.listen(port, host)
        console.log('Server listening on http://' + host + ':' + port)
      }
    )
    .catch((err) => console.error(err));
}
start()
