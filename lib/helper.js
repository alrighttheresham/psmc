/*
 * Helper functions
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */
'use strict';

exports.getClient = function (opts) {
    var Client = require('node-rest-client').Client;
    var options_auth = {user:opts.username, password:opts.password};
    return new Client(options_auth);
};