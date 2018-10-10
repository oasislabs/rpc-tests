var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    _ = require('underscore');

// METHOD
var method = 'eth_getStorageAt';


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

        expectedResult = Helpers.padLeft(expectedResult, 64);

        assert.equal(result.result, expectedResult, 'should match '+ expectedResult);

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

	    index = '0x';
            it('should return '+ config.contractStorage +' when the defaultBlock is "latest" for storage position '+ index +' at address '+ config.contractAddress, function(done){
                asyncTest(host, done, [
                    config.contractAddress,
                    index,
                    'latest'
                    ], config.contractStorage);
            });

            empty = '0x0000000000000000000000000000000000000000000000000000000000000000';
            it('should return '+ empty +' when the defaultBlock is 0 for storage position '+ index +' at address '+ config.contractAddress, function(done){
                asyncTest(host, done, [
                    config.contractAddress,
                    index,
                    '0x0'
                    ], empty);
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
