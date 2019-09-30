  
const Sentry =  require('@sentry/node')

const handler = require('./handler')

Sentry.init({ dsn: process.env.SENTRY_KEY })

exports.handler = async ({ path }, context, callback) => {
  try {
    const body = await handler(path)
    callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
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