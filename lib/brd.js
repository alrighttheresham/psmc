/*
 * Customer Information
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');


var callback = function (err) {
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
            metavar: 'MESSAGE',
            help: "send a broadcast message to all clients currently subscribed to PSM, message needs to be wrapped in single quotes"
        })
        .option('shutdown', {
            abbr: 'z',
            flag: true,
            help: "send a broadcast message to all clients informing them that there client will shutdown in the next 20 seconds"
        })
        .help("Provides a set of operations that can be broadcast to clients subscribed to a PSM Server.")
        .callback(function (opts) {
            if (opts.message) {
                var body = {"from" : opts.username, "message": opts.message};
                helper.requestWithEncoding(opts, "Broadcast", callback, body);
            } else if(opts.shutdown) {
                var body = {"from" : opts.username, "message": "", "shutdown": true};
                helper.requestWithEncoding(opts, "Broadcast", callback, body);
            }
        }
    );
};
