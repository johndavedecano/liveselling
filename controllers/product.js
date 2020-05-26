const Product = require('../models/Product')
const validator = require('validator')

exports.index = (req, res) => {
  Product.paginate(
    {
      user: req.user.id,
    },
    {
      offset: req.query.page - 1,
      limit: req.query.limit || 25,
    },
  ).then(function (result) {
    console.log(result)
    res.render('product/index', {
      title: 'Home',
      products: result,
      page: req.query.page,
      pagesCount: Math.ceil(result.total / (req.query.limit || 25)),
    })
  })
}

exports.createGet = (req, res) => {
  res.render('product/create', {
    title: 'Home',
    product: {},
  })
}

exports.createPost = (req, res) => {
  const validationErrors = []

  if (validator.isEmpty(req.body.name)) {
    validationErrors.push({ msg: 'Name field is required.' })
  }

  if (!req.file) {
    validationErrors.push({ msg: 'Photo is required' })
  }

  if (validationErrors.length) {
    req.flash('errors', validationErrors)
    return res.redirect('/products/create')
  }

  const product = new Product()

  product.name = req.body.name

  product.description = req.body.description

  product.price = Number(req.body.price) || 0

  product.user = req.user.id

  product.photos = [req.file.path]

  product.save((err) => {
    if (err) {
      return next(err)
    }

    req.flash('success', { msg: 'Success! Product was successfully created!' })

    return res.redirect('/products')
  })
}

exports.updateGet = (req, res) => {
  Product.findOne({ _id: req.params.id, user: req.user.id }, (err, result) => {
    if (err) {
      req.flash('error', { msg: 'Does not exists' })
      res.redirect('/products')
      return
    }
    console.log(result)
    res.render('product/update', {
      title: 'Home',
      product: result,
    })
  })
}

exports.updatePost = (req, res) => {
  const validationErrors = []

  console.log(req.body)

  if (validator.isEmpty(req.body.name)) {
    validationErrors.push({ msg: 'Name field is required.' })
  }

  if (validationErrors.length) {
    req.flash('errors', validationErrors)
    return res.redirect('/products/create')
  }

  Product.findOne({ _id: req.params.id, user: req.user.id }, (err, product) => {
    if (err) {
      req.flash('error', { msg: 'Does not exists' })
      res.redirect('/products')
      return
    }

    product.name = req.body.name

    product.description = req.body.description

    product.price = Number(req.body.price) || 0

    product.user = req.user.id

    if (req.file && req.file.path) {
      product.photos = [req.file.path]
    }

    product.save((err) => {
      if (err) {
        return next(err)
      }

      req.flash('success', {
        msg: 'Success! Product was successfully saved!',
      })

      return res.redirect('/products')
    })
  })
}

exports.deletePost = (req, res) => {
  Product.findOne({ _id: req.params.id, user: req.user.id }, (err, product) => {
    if (err) {
      req.flash('error', { msg: 'Does not exists' })
      res.redirect('/products')
      return
    }

    product.delete((err) => {
      if (err) {
        return next(err)
      }

      req.flash('success', {
        msg: 'Success! Product was successfully deleted!',
      })

      return res.redirect('/products')
    })
  })
}
