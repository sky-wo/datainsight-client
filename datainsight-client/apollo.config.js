require('dotenv').config({ path: '.env' })

module.exports = {
    client: {
        service: {
            name: 'datainsight-graphql-codegen',
            url: process.env.DATAINSIGHT_SERVER_ENDPOINT + 'graphql/'
        }
    }
};
