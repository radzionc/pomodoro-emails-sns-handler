const AWS = require("aws-sdk")

const sns = new AWS.SNS()

const getTopicParams = (arn, route) => ({
  Protocol: 'https',
  TopicArn: arn,
  Endpoint: `https://${process.env.DOMAIN}/${route}`
})

function subscribeSNS() {
  if(this.subscribed) return

  this.subscribed = true
  return Promise.all(
    [['TOPIC_ARN_BOUNCE', 'bounce'], ['TOPIC_ARN_COMPLAINT', 'complaint']]
    .map(([envKey, route]) => sns.subscribe(getTopicParams(process.env[envKey], route)).promise())
  )
}

module.exports = async (path, headers, body) => {
  console.log(path, headers, body)
  await subscribeSNS()
  
  return {
    DOMAIN: process.env.DOMAIN,
    TOPIC_ARN_BOUNCE: process.env.TOPIC_ARN_BOUNCE,
    TOPIC_ARN_COMPLAINT: process.env.TOPIC_ARN_COMPLAINT
  }
}