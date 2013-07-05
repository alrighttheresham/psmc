/*
 * System Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');

String.prototype.startsWith = function (s) {
    return (this.indexOf(s) === 0);

};


function radiusToConsole(data) {
    for (var i = 0; i < data.properties.property.length; i++) {
        var property = data.properties.property[i];
        if (property.key.startsWith("auth.radius.server")) {
            console.log("Server " + property.key.charAt(property.key.length - 1) + " : " + property.value);
        }
    }
}

var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        if (opts.radius) {
            radiusToConsole(data);
        }
    }
};

exports.command = function (opts) {
    opts.command('props')
        .option('radius', {
            abbr: 'r',
            flag: true,
            help: "(default) get the PSM Server Radius Properties"
        })
        .help("Provides properties defined on the PSM Server.")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "ServerInfo/Properties", callback);
        });
};


