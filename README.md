# memonow

Offline-enabled Web Editor

## Overview

Offline-enabled Web Editor. You can edit your text memo with this. 

You can use this app even if you miss online network. In that case, this app would store information in local DB, and sync them then your network would be re-activated.


## Pre-requisite

- Node.js and npm needed to be installed in your server.

- Create 'pouchdb' database on your Cloudant(CouchDB) instance.

    - This Cloudant instance need to be configured to allow Cross-Origin access. See http://dotnsf.blog.jp/archives/1070438078.html

- Create Query Index Design Document in that database for **user_id** string field:

    - ``{ "index": { "fields": [ { "name": "user_id", "type": "string" } ] }, "name": "user_id-index", .. }``

- Set username and password for Cloudant in settings.js as db_username and db_password.

- Get consumer_key and consumer_secret in Twitter Apps, and set them with callback_url in settings.js

    - https://apps.twitter.com/


## Install & Setup

- $ npm install

- $ node app


## Licensing

This code is licensed under MIT.

## Copyright

2018 [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.

