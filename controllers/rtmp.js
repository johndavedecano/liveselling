const User = require('../models/User')
const md5 = require('md5')

module.exports = function (req, res) {
  try {
    var streamEvent = req.body.event

    if (req.body.app === 'stream') {
      switch (streamEvent) {
        case 'publish':
          var streamKey = req.body.streamKey
          var streamToken = req.body.secret

          var currentToken = md5(process.env.SESSION_SECRET + streamKey)

          if (streamToken !== currentToken) {
            return res.status(401).send('Unauthorized channel')
          }

          User.findOne({ 'profile.streamKey': streamKey }, (err, user) => {
            if (err) {
              return res.status(401).send('Invalid stream')
            }

            user.profile.isLive = true

            user.save((_err) => {
              return res.status(200).send('Stream started')
            })
          })

          break

        case 'publish_done':
          console.log(req.body)
          var streamKey = req.body.streamKey
          var streamToken = req.body.secret

          var currentToken = md5(process.env.SESSION_SECRET + streamKey)

          if (streamToken !== currentToken) {
            return res.status(401).send('Unauthorized channel')
          }

          User.findOne({ 'profile.streamKey': streamKey }, (err, user) => {
            console.log(user)
            if (err) {
              return res.status(401).send('Invalid stream')
            }

            user.profile.isLive = false

            user.save((_err) => {
              res.status(200).send('Stream started')
            })
          })
          break
        default:
          return res.status(401).send('Unauthorized')
      }
    } else {
      return res.status(401).send('Unauthorized')
    }
  } catch (err) {
    console.error(err)
    return res.status(401).send(err.message)
  }
}
