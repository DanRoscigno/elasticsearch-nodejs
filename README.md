# elasticsearch-nodejs

## Deploy the Elastic Stack
I use cloud.elastic.co, it is super easy.  The config file shown later on uses a `cloudID` to specify the connection to Elasticsearch.  If you are deploying in Kubernetes, or bare metal, or some other way modify the connection details as needed.  All of the specifics are in the documentation at https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/basic-config.html


## Create the npm package.json
```
npm init
```

## Get the elasticsearch and config packages

Note: config is not required, use whatever method you prefer to keep your config details private.
```
npm install @elastic/elasticsearch
npm install config
```

## Create a configuration file

Gather your configuration details from the Elastic cloud console and populate
whatever configuration file you use, this example shows what the above `config` package expects.

```
mkdir config
vi config/default.json
```

`config/default.json`:
```
{
  "elastic": {
    "cloudID": "deploymentname:deploymentconnectiondetails",
    "username": "elastic",
    "password": "longpassword"
  }
}
```

A sample `helloWorld.json` is included in this repo, it is straight from the docs at https://github.com/elastic/elasticsearch-js#quick-start (with the addition of the config file)

```
node helloWorld.json
```

Output:
```
[
  {
    _index: 'game-of-thrones',
    _type: '_doc',
    _id: 'DBzq_ncBZE2R_LhmSSTs',
    _score: 1.3546093,
    _source: { character: 'Ned Stark', quote: 'Winter is coming.' }
  }
]
```

## Switch to using an API Key
Up above the authentication to Elasticsearch was done by using the `elastic`
username and password.  Using API Keys are a best practice, see the [ApiKey docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html) to learn about creating API Keys, and the [security privilege docs](https://www.elastic.co/guide/en/elasticsearch/reference/7.11/security-privileges.html) to understand which privileges are needed.  In the example below, the cluster `monitor` privilege is assigned to give read-only access to determine the cluster state etc.  The index privileges `create_index`, `write`, and `read` allow the creation of the index, write, update, delete, and read from that index.  The privilege `manage` is added to enable index refreshes.  If you are having a difficult time finding the right combination of privileges for your custom application you can get detailed logging by enabling [audit logging](https://www.elastic.co/guide/en/elasticsearch/reference/current/enable-audit-logging.html) on Elasticsearch.  

```
POST /_security/api_key
{
  "name": "nodejs_example",
  "role_descriptors": {
    "nodejs_example_writer": {
      "cluster": ["monitor"],
      "index": [
        {
          "names": ["game-of-thrones"],
          "privileges": ["create_index", "write", "read", "manage"]
        }
      ]
    }
  }
}
```

Output is:
```
{
  "id" : "nx9OEngBZE2R_LhmKJgG",
  "name" : "nodejs_example",
  "api_key" : "zMWKady5T4OxaJWAuXCgBg"
}
```

To use the above key in your Node.js code, concatenate the `id` and `api_key`
values (with a `:` separator) and pipe the string to `base64` like so:
```
echo -n 'nx9OEngBZE2R_LhmKJgG:zMWKady5T4OxaJWAuXCgBg' | base64
```

Output is:
```
bng5T0VuZ0JaRTJSX0xobUtKZ0c6ek1XS2FkeTVUNE94YUpXQXVYQ2dCZw==
```

Edit the configuration file created earlier and add the above API Key.  You can have more than one set of configurations, below is one for Cloud and one for self managed:
`config/default.json`:
```
{
  "elastic-cloud": {
    "cloudID": "deploymentname:deploymentconnectiondetails",
    "username": "elastic",
    "password": "longpassword",
    "apiKey": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX=="
  },
  "elastic-self-managed": {
    "node": "https://192.168.33.26:9200",
    "username": "elastic",
    "password": "changeme",
    "apiKey": "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZzzzzzzzzz=="
  }
}
```

Now the API Key can be used in place of the username and password.  The client connection becomes:

```
const client = new Client({
  cloud: {
    id: elasticConfig.cloudID
  },
  auth: {
    apiKey: elasticConfig.apiKey
  }
})
```
