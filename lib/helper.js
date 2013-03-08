/*
 * Helper class common to all commands
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';


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


exports.getURL = function (opts) {
    return "http://" + opts.server + "/";
};


exports.handleError = function (message) {
    console.log("Error: " + message);
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

