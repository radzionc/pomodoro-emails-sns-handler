module.exports = async (path, headers, body) => {
  console.log(path, headers, body)
  return { 
    TOPIC_ARN_BOUNCE: process.env.TOPIC_ARN_BOUNCE,
    TOPIC_ARN_COMPLAINT: process.env.TOPIC_ARN_COMPLAINT
  }
}