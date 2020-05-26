const path = require('path')

module.exports = {
  apps: [
    {
      name: 'store',
      script: 'app.js',
      error_file: path.resolve(__dirname, './logs/error.log'),
      out_file: path.resolve(__dirname, './logs/out.log'),
    },
    {
      name: 'rtmp',
      script: 'rtmp.js',
      error_file: path.resolve(__dirname, './logs/error.log'),
      out_file: path.resolve(__dirname, './logs/out.log'),
    },
  ],
}
