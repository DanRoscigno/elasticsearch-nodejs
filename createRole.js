'use strict'

const { Client } = require('@elastic/elasticsearch')
const config = require('config');
const elasticConfig = config.get('elastic');

// Your Cloud Id
const cloudId = elasticConfig.cloudID

// Your admin username
const username = elasticConfig.username

// Your admin password
const password = elasticConfig.password

// The indices or index patterns you will need to access
const indexNames = ['game-of-thrones']

// see https://www.elastic.co/guide/en/elasticsearch/reference/current/security-privileges.html#privileges-list-indices
const privileges = ['all']

async function generateApiKeys (opts) {
  const client = new Client({
    cloud: {
      id: cloudId
    },
    auth: {
      username,
      password
    }
  })

  const { body } = await client.security.createApiKey({
    body: {
      name: 'elasticsearch-proxy',
      role_descriptors: {
        "nodejs_example_writer": {
          "cluster": ["monitor"],
          "index": [
            {
              names: indexNames,
              privileges: privileges
            }
          ]
        }
      }
    }
  })

  return Buffer.from(`${body.id}:${body.api_key}`).toString('base64')
}

generateApiKeys()
  .then(console.log)
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
