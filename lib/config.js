var assert = require('chai').assert,
    _ = require('underscore'),
    getIpcPath = require('./getIpcPath.js');
// var chai = require('chai');
// chai.config.includeStack = false;
// chai.config.showDiff = false;

var config = {
    rpcMessageId: 1,
    hosts: {
        gateway: 'http://localhost:8545',
    },
    senderAddress: '1cca28600d7491365520b31b466f88647b9839ec',
    senderStartBalance: '0x56bc75e2d63100000',
    senderEndBalance: '0x56bc70ffd66f5e000',
    contractAddress: '0xf75d55dd51ee8756fbdb499cc1a963e702a52091',
    contractCode: '0x60806040526004361060485763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630dbe671f8114604d5780631003e2d2146071575b600080fd5b348015605857600080fd5b50605f6086565b60408051918252519081900360200190f35b348015607c57600080fd5b50605f600435608c565b60005481565b60005401905600a165627a7a72305820df86d6dbe703b640fb29a0e72f7d2d7d1c78464b56088fd4ccfcd75733e395b30029',
    contractStorage: '0x0000000000000000000000000000000000000000000000000000000000000001',
    testBlocks: require('./blocks.json').RPC_API_Test,
    logs: [{
        eventName: "log4a", // for debug purposes only
        call: '0x9dc2c8f5',
        anonymous: true,
        indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
        args: [-23, 42]
    },{
        eventName: "log4",
        call: '0xfd408767',
        anonymous: false,
        indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
        args: [-23, 42]
    },{
        eventName: "log3a",
        call: '0xe8beef5b',
        anonymous: true,
        indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
        args: [42]
    },{
        eventName: "log3",
        call: '0xf38b0600',
        anonymous: false,
        indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
        args: [42]
    },{
        eventName: "log2a",
        call: '0x76bc21d9',
        anonymous: true,
        indexArgs: [true, 'msg.sender'],
        args: [42]
    },{
        eventName: "log2",
        call: '0x102accc1',
        anonymous: false,
        indexArgs: [true, 'msg.sender'],
        args: [42]
    },{
        eventName: "log1a",
        call: '0x4e7ad367',
        anonymous: true,
        indexArgs: [true],
        args: [42]
    },{
        eventName: "log1",
        call: '0xb61c0503',
        anonymous: false,
        indexArgs: [true],
        args: [42]
    },{
        eventName: "log0a",
        call: '0xa6780857',
        anonymous: true,
        indexArgs: [],
        args: [42]
    },{
        eventName: "log0",
        call: '0x65538c73',
        anonymous: false,
        indexArgs: [],
        args: [42]
    }]
};

// from the oldest to the newest!
config.logs.reverse();

// add the log.block, log.tx and log.txIndex
config.logs = _.map(config.logs, function(log){
    var transaction = null,
        txIndex = null;
    log.block = _.find(config.testBlocks.blocks, function(block){
        return _.find(block.transactions, function(tx, index){
            if (tx.data === log.call){
                transaction = tx;
                txIndex = index;
                return true;
            } else
                return false;
        });
    });
    log.tx = transaction;
    log.txIndex = txIndex;
    //console.log(log.eventName + " : " + log.block.blockHeader.hash);
    return log;
});

// prepare test for querying forked blocks
var reverted = config.testBlocks.blocks.filter(function (block) {
    return block.reverted === true;
});

var decent = config.testBlocks.blocks.filter(function (block) {
    if (block.reverted === true) {
        return false;
    }

    return !!_.findWhere(reverted, { blocknumber: block.blocknumber});
});

// assuming there is only 1 fork
/*
config.specialLogQuery = {
    fromBlock: '0x' + _.last(reverted).blockHeader.hash,
    toBlock: '0x' + _.last(decent).blockHeader.hash
};
*/

var route = reverted.reverse().concat(decent);

var specialLogs = _.map(route, function (block) {
    var tx = block.transactions[0];
    var log = _.findWhere(config.logs, { call: tx.data});
    log = _.extend({}, log); // copy it
    log.tx = tx;
    log.txIndex = 0;
    log.block = block;
    return log;
});

config.specialLogResult = specialLogs; 

module.exports = config;

