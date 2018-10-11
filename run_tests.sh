#!/bin/bash
./setup/request.sh setup/payload
./node_modules/mocha/bin/mocha --reporter dot test/1_testConnection.js test/*.js
