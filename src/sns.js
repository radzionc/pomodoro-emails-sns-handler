const AWS = require('aws-sdk')

const { TOPIC_ARN } = require('./constants')

let sns = null

const getTopicParams = (arn, route) => ({
  Protocol: 'https',
  TopicArn: arn,
  Endpoint: `${process.env.DOMAIN}/${route}`
})

module.exports = {
  getSubscribedSns: async () => {
    if (!sns) {
      sns = new AWS.SNS({
        region: 'us-east-1'
      })
      await Promise.all(
        Object.entries(TOPIC_ARN)
        .map(([route,  arn]) => sns.subscribe(getTopicParams(arn, route)).promise())
      )
    }
    return sns
  }
}