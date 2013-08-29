/*
 * Customer Information
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');


var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        // do nout.
    }
};

exports.command = function (opts) {
    opts.command('brd')
        .option('message', {
            abbr: 'm',
            metavar: 'NAME',
            help: "send a broadcast message to all clients currently subscribed to PSM, message needs to be wrapped in single quotes"
        })
        .help("Provides a set of operations that can be broadcast to clients subscribed to a PSM Server.")
        .callback(function (opts) {
            if (opts.message) {
                var body = {"message": opts.message};
                helper.requestWithEncoding(opts, "Broadcast", callback, body);
            }
        }
    );
};
