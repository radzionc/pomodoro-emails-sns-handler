const AWS = require('aws-sdk')

const { TOPIC_ARN } = require('constants')

let sns = null

const getTopicParams = (arn, route) => ({
  Protocol: 'https',
  TopicArn: arn,
  Endpoint: `https://${process.env.DOMAIN}/${route}`
})

module.exports = {
  getSubscribedSns: async () => {
    if (!sns) {
      sns = new AWS.SNS()
      await Promise.all(
        Object.entries(TOPIC_ARN)
        .map(([envKey, route]) => sns.subscribe(getTopicParams(process.env[envKey], route)).promise())
      )
    }
    return sns
  }
}