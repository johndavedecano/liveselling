/**
 * Module dependencies.
 */
const express = require('express')
const compression = require('compression')
const session = require('express-session')
const bodyParser = require('body-parser')
const logger = require('morgan')
const chalk = require('chalk')
const errorHandler = require('errorhandler')
const lusca = require('lusca')
const dotenv = require('dotenv')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const expressStatusMonitor = require('express-status-monitor')
const sass = require('node-sass-middleware')

const configureControllers = require('./controllers')

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' })

/**
 * Create Express server.
 */
const app = express()

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('error', (err) => {
  console.error(err)
  console.log(
    '%s MongoDB connection error. Please make sure MongoDB is running.',
    chalk.red('✗'),
  )
  process.exit()
})

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0')
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(expressStatusMonitor())
app.use(compression())
app.use(
  sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
  }),
)
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      autoReconnect: true,
    }),
  }),
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  console.log(req.path)
  if (
    req.path === '/api/upload' ||
    req.path === '/account/picture' ||
    req.path.indexOf('/products') !== -1 ||
    req.path === '/rtmp'
  ) {
    // Multer multipart/form-data handling needs to occur before the Lusca CSRF check.
    next()
  } else {
    lusca.csrf()(req, res, next)
  }
})

app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.disable('x-powered-by')

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.STREAM_SERVER_URL = process.env.STREAM_SERVER_URL
  next()
})

app.use(
  '/',
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }),
)
app.use(
  '/js/lib',
  express.static(path.join(__dirname, 'node_modules/chart.js/dist'), {
    maxAge: 31557600000,
  }),
)
app.use(
  '/js/lib',
  express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), {
    maxAge: 31557600000,
  }),
)
app.use(
  '/js/lib',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), {
    maxAge: 31557600000,
  }),
)
app.use(
  '/js/lib',
  express.static(path.join(__dirname, 'node_modules/jquery/dist'), {
    maxAge: 31557600000,
  }),
)
app.use(
  '/webfonts',
  express.static(
    path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'),
    { maxAge: 31557600000 },
  ),
)

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), { maxAge: 31557600000 }),
)

configureControllers(app)

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler())
} else {
  app.use((err, _req, res, _next) => {
    console.error(err)
    res.status(500).send('Server Error')
  })
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(
    '%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env'),
  )
  console.log('  Press CTRL-C to stop\n')
})

module.exports = app
