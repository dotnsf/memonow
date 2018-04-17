# memonow

Offline-enabled Web Text Editor

## Overview

Offline-enabled Web Text Editor. You can edit your text memo with this. 

You can use this app even if you miss online network. In that case, this app would store information in local DB, and sync them then your network would be re-activated.

When you use smartphone(with small screen), your text editor would be very simple one(simple textarea). But when you use large-enough screen device, you can edit/preview your text with Mard-Down text editor.


## Pre-requisite before install

- Node.js and npm needed to be installed in your application server.

- IBM Cloudant instance needed.

- Create 'pouchdb' database on your IBM Cloudant instance.

    - This Cloudant instance need to be configured to allow Cross-Origin access. See http://dotnsf.blog.jp/archives/1070438078.html

- Create Query Index Design Document in that database for **user_id** string field:

    - ``{ "index": { "fields": [ { "name": "user_id", "type": "string" } ] }, "name": "user_id-index", "type": "text", .. }``

- Set username and password for IBM Cloudant in settings.js as db_username and db_password.

- Get consumer_key and consumer_secret in Twitter Apps, and set them with callback_url in settings.js

    - https://apps.twitter.com/


## Install & Setup

- $ npm install

- $ node app


## Working Demo

https://memonow.mybluemix.net/


## Clean local db

If you want to clean your local db(in browser), you can do that by accessing /resetdb :

https://memonow.mybluemix.net/resetdb


## Using Technologies/Services

- IBM Cloudant

    - https://www.ibm.com/jp-ja/marketplace/database-management

- PouchDB

    - https://pouchdb.com/

- Node.js

    - https://nodejs.org/


## Licensing

This code is licensed under MIT.

## Copyright

2018 [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.

