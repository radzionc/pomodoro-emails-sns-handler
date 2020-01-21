const Sentry =  require('@sentry/node')

const { setNewValue, mergedParams, searchByKeyParams, projectionExpression, paginationAware } = require('awsdynamoutils')

const USERS_TABLE = 'pomodoro_users'

const userDefaultParams = id => ({
  TableName: USERS_TABLE,
  Key: { id }
})

const scan = paginationAware('scan')

const getByEmail = (email, attributes = undefined) =>
  scan(
    mergedParams(
      { TableName: USERS_TABLE },
      searchByKeyParams('email', email),
      projectionExpression(attributes)
    )
  )
  .then(items => items[0])

module.exports = {
  stopSendingEmailsTo: async (email) => {
    const user = await getByEmail(email, ['id'])
    if (user) {
      await setNewValue(userDefaultParams(user.id), 'ignoreEmails', true)
    } else {
      Sentry.captureMessage(`No ${email} user found`)
      await Sentry.flush(1000)
    }
  }
}