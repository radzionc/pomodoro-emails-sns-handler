const { stopSendingEmailsTo } = require('./users')
const { TOPIC_ARN } = require('./constants')
const { getSubscribedSns } = require('./sns')

module.exports = async (path, headers, body) => {
  const messageType = headers['x-amz-sns-message-type']
  if (messageType === 'Notification' && body.Message) {
    const message = JSON.parse(body.Message)
    const { notificationType, mail } = message
    if (['Bounce', 'Complaint'].includes(notificationType) && mail) {
      await Promise.all(mail.destination.map(stopSendingEmailsTo))
    }
  } else if (messageType === 'SubscriptionConfirmation') {
    const route = path.split('/')[1]
    const topicArn = TOPIC_ARN[route]
    if (!topicArn) {
      throw new Error(`Invalid route: ${route}`)
    }
    const sns = await getSubscribedSns()
    await sns.confirmSubscription({
      Token: body.Token,
      TopicArn: topicArn
    }).promise()
  }
}