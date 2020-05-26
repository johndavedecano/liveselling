const User = require('../models/User')
const Product = require('../models/Product')

module.exports = (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      req.flash('error', { msg: 'Does not exists' })
      res.redirect('/browse')
      return
    }

    Product.paginate(
      {
        user: req.params.id,
      },
      {
        offset: req.query.page - 1,
        limit: req.query.limit || 25,
      },
    ).then(function (products) {
      res.render('store', {
        title: user.profile.storeName,
        user: user,
        products: products,
        page: req.query.page,
        pagesCount: Math.ceil(products.total / (req.query.limit || 25)),
        playbackUrl:
          process.env.STREAM_PLAYBACK_URL +
          '/' +
          user.profile.streamKey +
          '.flv',
      })
    })
  })
}
