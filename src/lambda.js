  
const Sentry =  require('@sentry/node')

const handler = require('./handler')

Sentry.init({ dsn: process.env.SENTRY_KEY })

exports.handler = async ({ path, headers, body }, context, callback) => {
  try {
    await handler(path, headers, JSON.parse(body))
  } catch (error) {
    console.log(error)
    Sentry.withScope(scope => {
      scope.setExtra('path', path)
      Sentry.captureException(error)
    })
    await Sentry.flush()
  }
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{}'
  })
}