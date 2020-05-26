const upload = require('./../helpers/configure-multer')('local')

module.exports = (app) => {
  /**
   * Controllers (route handlers).
   */
  const homeController = require('./home')
  const userController = require('./user')
  const contactController = require('./contact')
  const rtmpController = require('./rtmp')
  const productController = require('./product')
  const browseController = require('./browse')
  const storeController = require('./store')

  /**
   * API keys and Passport configuration.
   */
  const passportConfig = require('./../config/passport')

  app.use((req, _res, next) => {
    // After successful login, redirect back to the intended page
    if (
      !req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)
    ) {
      req.session.returnTo = req.originalUrl
    } else if (
      req.user &&
      (req.path === '/account' || req.path.match(/^\/api/))
    ) {
      req.session.returnTo = req.originalUrl
    }
    next()
  })

  /**
   * Primary app routes.
   */
  app.get('/', homeController.index)
  app.get('/login', userController.getLogin)
  app.post('/login', userController.postLogin)
  app.get('/logout', userController.logout)
  app.get('/forgot', userController.getForgot)
  app.post('/forgot', userController.postForgot)
  app.get('/reset/:token', userController.getReset)
  app.post('/reset/:token', userController.postReset)
  app.get('/signup', userController.getSignup)
  app.post('/signup', userController.postSignup)
  app.get('/contact', contactController.getContact)
  app.post('/contact', contactController.postContact)
  app.get(
    '/account/verify',
    passportConfig.isAuthenticated,
    userController.getVerifyEmail,
  )
  app.get(
    '/account/verify/:token',
    passportConfig.isAuthenticated,
    userController.getVerifyEmailToken,
  )
  app.get('/account', passportConfig.isAuthenticated, userController.getAccount)

  app.post(
    '/account/profile',
    passportConfig.isAuthenticated,
    userController.postUpdateProfile,
  )

  app.post(
    '/account/stream',
    passportConfig.isAuthenticated,
    userController.postUpdateStream,
  )

  app.post(
    '/account/picture',
    passportConfig.isAuthenticated,
    upload.single('myFile'),
    userController.postUpdatePicture,
  )

  app.post(
    '/account/password',
    passportConfig.isAuthenticated,
    userController.postUpdatePassword,
  )

  app.post(
    '/account/delete',
    passportConfig.isAuthenticated,
    userController.postDeleteAccount,
  )

  app.get(
    '/account/unlink/:provider',
    passportConfig.isAuthenticated,
    userController.getOauthUnlink,
  )

  app.post('/rtmp', rtmpController)

  app.get('/products', passportConfig.isAuthenticated, productController.index)

  app.get(
    '/products/create',
    passportConfig.isAuthenticated,
    productController.createGet,
  )

  app.post(
    '/products/create',
    passportConfig.isAuthenticated,
    upload.single('myFile'),
    productController.createPost,
  )

  app.get(
    '/products/:id/update',
    passportConfig.isAuthenticated,
    productController.updateGet,
  )

  app.post(
    '/products/:id/update',
    passportConfig.isAuthenticated,
    upload.single('myFile'),
    productController.updatePost,
  )

  app.get(
    '/products/:id/delete',
    passportConfig.isAuthenticated,
    productController.deletePost,
  )

  app.get('/browse', browseController)

  app.get('/stores/:id', storeController)
}
