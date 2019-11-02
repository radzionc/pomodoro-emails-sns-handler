const { stopSendingNewsTo } = require('./users')
const { TOPIC_ARN } = require('./constants')
const { getSubscribedSns } = require('./sns')

module.exports = async (path, headers, body) => {
  const sns = await getSubscribedSns()
  const messageType = headers['x-amz-sns-message-type']
  console.log('message type: ', messageType)
  if (messageType === 'Notification' && body.Message) {
    const message = JSON.parse(body.Message)
    const { notificationType, mail } = message
    console.log(`notification type: ${notificationType}, mail: ${mail}`)
    if (['Bounce', 'Complaint'].includes(notificationType) && mail) {
      await Promise.all(mail.destination.map(stopSendingNewsTo))
    }
  } else if (messageType === 'SubscriptionConfirmation') {
    const route = path.split('/')[1]
    const topicArn = TOPIC_ARN[route]
    if (!topicArn) {
      throw new Error(`Invalid route: ${route}`)
    }
    await sns.confirmSubscription({
      Token: body.Token,
      TopicArn: topicArn
    }).promise()
  }
}