'use strict';

var erps = require('../lib/erps.js');

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

exports.testPortRoleToString = function (test) {
    test.expect(1);
    test.equal(erps.portRoleToString(true), 'rpl port', 'should be rpl port');
    test.done();
};

exports.testPortRoleToString = function (test) {
    test.expect(6);
    test.equal(erps.serviceStateToString("PROTECTION"), 'protecting', 'should be protecting');
    test.equal(erps.serviceStateToString("IDLE"), 'idle', 'should be idle');
    test.equal(erps.serviceStateToString("FORCE_SWITCH"), 'forced', 'should be force switch');
    test.equal(erps.serviceStateToString("MANUAL_SWITCH"), 'manual', 'should be manual switch');
    test.equal(erps.serviceStateToString("PENDING"), 'pending', 'should be pending');
    test.equal(erps.serviceStateToString("DISABLE"), 'disable', 'should be disable');
    test.done();
};

exports.testLinkStateToString = function(test) {
    test.expect(3);
    test.equal(erps.linkStateToString("FAILED", "FAILED"), 'signal fail', 'should be signal fail');
    test.equal(erps.linkStateToString("OK", "FAILED"), 'remote signal fail', 'should be remote signal fail');
    test.equal(erps.linkStateToString("OK", "OK"), 'normal', 'should be normal');
    test.done();
};

exports.testPortStateToString = function(test) {
    test.expect(3);
    test.equal(erps.portStateToString("UNBLOCKED"), 'unblocked', 'should be unblocked');
    test.equal(erps.portStateToString("BLOCKING"), 'blocked', 'should be blocked');
    test.equal(erps.portStateToString(null), 'undefined', 'should be undefined');
    test.done();
};
