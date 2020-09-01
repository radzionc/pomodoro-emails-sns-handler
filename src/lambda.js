const Sentry =  require('@sentry/node')
const { getReportError } = require('increaser-utils')

const handler = require('./handler')

Sentry.init({ dsn: process.env.SENTRY_KEY })

const reportError = getReportError(Sentry, [], 2000)

exports.handler = async ({ path, headers, body }, context, callback) => {
  try {
    await handler(path, headers, JSON.parse(body))
  } catch (error) {
    await reportError('Fail to process', { path }, error)
  }
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{}'
  })
}