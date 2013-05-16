'use strict';

var noc = require('../lib/noc.js');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

var testObject = {
    "trapReceiver": [
        {
            "community": "community",
            "port": 4000,
            "ipAddress": "127.0.0.1",
            "id": 1,
            "filters": {
                "filter": [
                    {
                        "join": "AND",
                        "field": "DESCRIPTION",
                        "operator": "EQUALS",
                        "value": "damian",
                        "id": 1
                    }
                ]
            }
        }
    ]
};

exports.testGetTrapReceiver = function (test) {
    test.expect(3);
    test.equal(noc.getTrapReceiver(testObject.trapReceiver[0])[0], '127.0.0.1', 'should be 127.0.0.1');
    test.equal(noc.getTrapReceiver(testObject.trapReceiver[0])[1], 4000, 'should be 4000');
    test.equal(noc.getTrapReceiver(testObject.trapReceiver[0])[2], 'community', 'should be community');
    test.done();
};


exports.testGetFilterDetails = function (test) {
    test.expect(4);
    test.equal(noc.getFilterDetails(testObject.trapReceiver[0].filters.filter[0])[0], 'DESCRIPTION', 'should be DESCRIPTION');
    test.equal(noc.getFilterDetails(testObject.trapReceiver[0].filters.filter[0])[1], 'EQUALS', 'should be EQUALS');
    test.equal(noc.getFilterDetails(testObject.trapReceiver[0].filters.filter[0])[2], 'damian', 'should be damian');
    test.equal(noc.getFilterDetails(testObject.trapReceiver[0].filters.filter[0])[3], 'AND', 'should be AND');
    test.done();
};
