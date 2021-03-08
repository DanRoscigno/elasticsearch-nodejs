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
username and password.  Using API Keys are a best practice, see the docs at .......

```
POST /_security/api_key
{
  "name": "gameofthrones_example",
  "role_descriptors": {
    "nodejs_example_writer": {
      "cluster": ["monitor"],
      "index": [
        {
          "names": ["game-of-thrones"],
          "privileges": ["all"]
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
values (with a `:` seperator) like so:
```
echo -n 'nx9OEngBZE2R_LhmKJgG:zMWKady5T4OxaJWAuXCgBg' | base64
```

Output is:
```
bng5T0VuZ0JaRTJSX0xobUtKZ0c6ek1XS2FkeTVUNE94YUpXQXVYQ2dCZw==
```

Edit the configuration file created earlier and add the above API Key

`config/default.json`:
```
{
  "elastic": {
    "cloudID": "deploymentname:deploymentconnectiondetails",
    "username": "elastic",
    "password": "longpassword"
    "apiKey": "bng5T0VuZ0JaRTJSX0xobUtKZ0c6ek1XS2FkeTVUNE94YUpXQXVYQ2dCZw=="
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
