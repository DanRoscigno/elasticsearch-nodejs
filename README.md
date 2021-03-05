# elasticsearch-nodejs

## Deploy the Elastic Stack
I use cloud.elastic.co, it is super easy.  The config file shown later on uses a `cloudID` to specify the connection to Elasticsearch.  If you are deploying in Kubernetes, or bare metal, or some other way modify the connection details as needed.  All of the specifics are in the documenttion at https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/basic-config.html


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

A sample helloWorld.json is included in this repo, it is straight from the docs at https://github.com/elastic/elasticsearch-js#quick-start (with the addition of the config file)
