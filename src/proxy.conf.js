require('dotenv').config({ path: '.env' })

/**
 * DATAINSIGHT_SERVER_ENDPOINT
 * - like http://192.168.87.125:9999/
 * */

const PROXY_CONFIG = [
  {
    context: [
      "/graphql"
    ],
    target: process.env.DATAINSIGHT_SERVER_ENDPOINT,
    secure: false
  }
]

module.exports = PROXY_CONFIG;
