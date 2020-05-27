const User = require('../models/User')

module.exports = (req, res) => {
  User.paginate(
    {},
    {
      offset: req.query.page - 1,
      limit: req.query.limit || 25,
    },
  ).then(function (result) {
    console.log(result)
    res.render('catalog', {
      title: 'Products',
      users: result,
      page: req.query.page,
      pagesCount: Math.ceil(result.total / (req.query.limit || 25)),
    })
  })
}
