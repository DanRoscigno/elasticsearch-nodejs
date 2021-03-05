# elasticsearch-nodejs

Create the npm package.json
```
npm init
```

Get the elasticsearch and config packages

Note: config is not required, use whatever method you prefer to keep your config details private.
```
npm install @elastic/elasticsearch
npm install config
```

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
