/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (_req, res) => {
  res.render('api/index', {
    title: 'API Examples',
  })
}

/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (_req, res) => {
  res.render('api/upload', {
    title: 'File Upload',
  })
}

exports.postFileUpload = (req, res) => {
  console.log(req.file.path)
  req.flash('success', { msg: 'File was uploaded successfully.' })
  res.redirect('/api/upload')
}
