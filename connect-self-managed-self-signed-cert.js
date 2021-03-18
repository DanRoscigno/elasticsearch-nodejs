'use strict'
const tls = require('tls');
const fs = require('fs');

const { Client } = require('@elastic/elasticsearch')
const config = require('config');
const elasticConfig = config.get('elastic-self-managed');

const client = new Client({ 
  node: elasticConfig.node,
  auth: {
    /*username: elasticConfig.username,
    password: elasticConfig.password*/
    apiKey: elasticConfig.apiKey
  },
  ssl: {
    ca: fs.readFileSync('../my-forks/ELK-Stack-with-Vagrant-and-Ansible/files/certs/ca/ca.crt'),
    rejectUnauthorized: false
  }
})

client.info()
  .then(response => console.log(response))
  .catch(error => console.error(error))

