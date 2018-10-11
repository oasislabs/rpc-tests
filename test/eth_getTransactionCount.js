var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'eth_getTransactionCount';


// TEST
var asyncTest = function(host, done, params, expectedResult){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params

    }, function(result, status) {

        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isString(result.result, 'is string');
        assert.match(result.result, /^0x/, 'should be HEX starting with 0x');
        assert.isNumber(+result.result, 'can be converted to a number');

        assert.equal(+result.result, expectedResult, 'should be '+ expectedResult);

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
            it('should return the current number of transactions as a hexstring when the defaultBlock is 0', function(done){
                asyncTest(host, done, [config.senderAddress, '0x0'], 0);
            });

            it('should return the current number of transactions as a hexstring when the defaultBlock is "latest"', function(done){
                asyncTest(host, done, [config.senderAddress, 'latest'], 1);
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
