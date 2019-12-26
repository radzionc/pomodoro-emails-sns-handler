const { documentClient, setNewValue, mergedParams, searchByKeyParams, projectionExpression } = require('awsdynamoutils')

const USERS_TABLE = 'pomodoro_users'

const userDefaultParams = id => ({
  TableName: USERS_TABLE,
  Key: { id }
})

const getByEmail = (email, attributes = undefined) =>
  documentClient
    .scan(
      mergedParams(
        { TableName: USERS_TABLE },
        searchByKeyParams('email', email),
        projectionExpression(attributes)
      )
    )
    .promise()
    .then(data => data.Items[0])

module.exports = {
  stopSendingEmailsTo: async (email) => {
    const { id } = await getByEmail(email, ['id'])
    await setNewValue(userDefaultParams(id), 'ignoreEmails', true)
  }
}