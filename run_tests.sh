#!/bin/bash
./setup/request_raw.sh eth_blockNumber
./setup/request.sh setup/payload
./node_modules/mocha/bin/mocha --reporter dot test/1_testConnection.js test/*.js
