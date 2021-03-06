var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    _ = require('underscore');

// METHOD
var method = 'eth_getBlockTransactionCountByHash';


// TEST
var asyncTest = function(host, done, params, expectedResult){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params

    }, function(result, status) {

        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');

        if(!result.result) {
            assert.isNull(result.result);
        } else {
            assert.isString(result.result, 'is string');
            assert.match(result.result, /^0x/, 'should be HEX starting with 0x');
            assert.isNumber(+result.result, 'can be converted to a number');

            assert.equal(+result.result, expectedResult, 'should be '+ expectedResult);
        }

        done();
    });
};


var asyncErrorTest = function(host, done){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: []

    }, function(result, status) {

        assert.equal(status, 200, 'has status code');
        assert.property(result, 'error');
        assert.equal(result.error.code, -32602);

        done();
    });
};


describe(method, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){
            _.each(config.testBlocks.blocks, function(block){
                Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_getBlockByNumber',

                    // PARAMETERS
                    params: [block.blockHeader.number, false]
                }, function(givenBlock){
                    it('should return '+block.transactions.length+' as a hexstring', function(done){
                        asyncTest(host, done, ['0x'+ givenBlock.blockHeader.hash], block.transactions.length);
                    });
                });
            });

            it('should return null if the block doesnt exist', function(done){
                asyncTest(host, done, ['0x878a132155f53adb7c993ded4cfb687977397d63d873fcdbeb06c18cac907a5c'], null);
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
