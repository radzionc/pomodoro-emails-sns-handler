  
const Sentry =  require('@sentry/node')

const handler = require('./handler')

Sentry.init({ dsn: process.env.SENTRY_KEY })

exports.handler = async ({ path, headers, body }, context, callback) => {
  try {
    const response = await handler(path, headers, body)
    callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    })
  } catch (error) {
    console.log(error)
    Sentry.withScope(scope => {
      scope.setExtra('path', path)
      Sentry.captureException(error)
    })
    await Sentry.flush()
  }
}