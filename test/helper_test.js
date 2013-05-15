'use strict';

var helper = require('../lib/helper.js');

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

exports.testGetOptions = function (test) {
    test.expect(3);
    var opts = {username: "u", password: "p"};
    test.equal(helper.getOptions(opts).username, 'u', 'should be u');
    test.equal(helper.getOptions(opts).password, 'p', 'should be p');
    test.equal(helper.getOptions(opts).headers.Accept, '*/*', 'should be */*');
    test.done();

};

exports.testNotNull = function (test) {
    test.expect(1);
    test.equal(helper.notNull("Something"), 'Something', 'should be Something.');
    test.done();
};

exports.testGetURL = function (test) {
    test.expect(1);
    var opts = {server: "localhost"};
    test.equal(helper.getURL(opts), 'http://localhost/', 'should be http://localhost/.');
    test.done();
};

exports.testGetDurationFromMilliSeconds = function (test) {
    test.expect(1);
    test.equal(helper.getDurationFromMilliSeconds(1368624185), '15 days 20 hours 10 mins ', 'should be 15 days 20 hours 10 mins .');
    test.done();
};


exports.testSpaceFill = function (test) {
    test.expect(1);
    test.equal(helper.spaceFill(10,10), '        10', 'should be         10.');
    test.done();
};