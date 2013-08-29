/*
 * Helper class common to all commands
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';
var request = require('request');
var zlib = require('zlib');


var headers = {
    "accept": "*/*",
    "user-agent": "psmc",
    "accept-encoding": "gzip"
};

var auth = {
    'user': 'admin',
    'pass': 'admin',
    'sendImmediately': true
};

var options = {
    url: "http://localhost:9998/",
    headers: headers,
    auth: auth,
    body: ''
};


exports.requestWithEncoding = function (opts, resource, callback, body) {
    auth.user = opts.username;
    auth.pass = opts.password;
    options.url = "http://" + opts.server + "/" + resource;

    var req;

    if (body) {
        // ASSUME its a POST, just send and ignore response
        options.body = JSON.stringify(body);
        req = request.post(options);
    } else {
        req = request.get(options);

        req.on('response', function (res) {
            var chunks = [];

            res.on('data', function (chunk) {
                chunks.push(chunk);
            });

            res.on('end', function () {
                if (res.statusCode === 401) {
                    callback("Authentication failed", opts);
                } else if (res.statusCode !== 200) {
                    callback("Problem with Requests", opts);
                } else {
                    var buffer = Buffer.concat(chunks);
                    var encoding = res.headers['content-encoding'];
                    if (encoding === 'gzip') {
                        zlib.gunzip(buffer, function (err, decoded) {
                            callback(err, opts, JSON.parse(decoded && decoded.toString()));
                        });
                    } else if (encoding === 'deflate') {
                        zlib.inflate(buffer, function (err, decoded) {
                            callback(err, opts, decoded && decoded.toString());
                        });
                    } else {
                        callback(null, opts, buffer.toString());
                    }
                }
            });
        });

        req.on('error', function (err) {
            callback(err, opts);
        });
    }
};


// REMOVE
exports.getOptions = function (opts) {
    return {
        username: opts.username,
        password: opts.password,
        headers: {
            'Accept': '*/*',
            'User-Agent': 'psmc',
            'Accept-Encoding': 'gzip'
        }
    };
};

// REMOVE
exports.not200 = function (res, request) {
    if (res.statusCode === 401) {
        console.log("Authentication failed for " + request);
    } else {
        console.log("Status Code: '" + res.statusCode + "'");
    }
};

// REMOVE
exports.getURL = function (opts) {
    return "http://" + opts.server + "/";
};

// REMOVE
exports.handleError = function (message) {
    console.log("Error: " + message);
};

exports.notNull = function (value) {
    if (value === null) {
        value = "";
    }
    return value;
};

exports.getDurationFromMilliSeconds = function (v) {
    function z(n) {
        return (n < 10 ? '0' : '') + n;
    }

    var days = v / 8.64e7 | 0;
    var hrs = (v % 8.64e7) / 3.6e6 | 0;
    var mins = Math.round((v % 3.6e6) / 6e4);
    return days + ' days ' + z(hrs) + ' hours ' + z(mins) + ' mins ';
};

exports.spaceFill = function (number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join(' ') + number;
    }
    return number + ""; // always return a string
};