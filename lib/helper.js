/*
 * Helper class common to all commands
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

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
}


exports.handleError = function (message) {
    console.log("Error: " + message);
}