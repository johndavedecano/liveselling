const NodeMediaServer = require('node-media-server')
const axios = require('axios')

const dotenv = require('dotenv')

dotenv.config({ path: '.env' })

var http = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 1000,
})

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: '*',
  },
}

var tokens = {}

const parseStreamName = (streamPath) => {
  return streamPath.replace('/stream/', '').replace('/live/', '')
}

var nms = new NodeMediaServer(config)

nms.on('prePublish', async (id, StreamPath, args) => {
  const streamName = parseStreamName(StreamPath)

  if (args.secret) {
    tokens[streamName] = {
      app: 'stream',
      streamKey: streamName,
      secret: args.secret,
      event: 'publish',
    }
  }

  if (tokens[streamName]) {
    let session = nms.getSession(id)
    await http.post('/rtmp', tokens[streamName]).catch((err) => {
      console.error(err.message)
      session.reject()
    })
  }
})

nms.on('donePublish', async (id, StreamPath, _args) => {
  const streamName = parseStreamName(StreamPath)
  if (tokens[streamName]) {
    let session = nms.getSession(id)
    await http
      .post('/rtmp', {
        app: 'stream',
        streamKey: streamName,
        secret: tokens[streamName].secret,
        event: 'publish_done',
      })
      .catch((err) => {
        console.error(err.message)
        session.reject()
      })
  }
})

nms.run()
