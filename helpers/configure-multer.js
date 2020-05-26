/**
 * Module dependencies.
 */

const { v4 } = require('uuid')

const multer = require('multer')

module.exports = (service = 'local') => {
  if (service === 'local') {
    const storage = multer.diskStorage({
      destination: function (_req, _file, cb) {
        cb(null, 'uploads/')
      },
      filename: function (_req, file, cb) {
        fileExtension = file.originalname.split('.')[1]
        cb(null, v4() + '.' + fileExtension)
      },
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype == 'image/png' ||
          file.mimetype == 'image/jpg' ||
          file.mimetype == 'image/jpeg'
        ) {
          cb(null, true)
        } else {
          cb(null, false)
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
        }
      },
    })
    return multer({ storage })
  }
}
