/*
 * System Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var helper = require('./helper');

String.prototype.startsWith = function (s) {
    if (this.indexOf(s) == 0) return true;
    return false;
}


function radiusToConsole(data) {
    for (var i = 0; i < data.properties.property.length; i++) {
        var property = data.properties.property[i];
        if (property.key.startsWith("auth.radius.server")) {
            console.log("Server " + property.key.charAt( property.key.length-1 ) + " : " + property.value);
        }
    }
}


exports.command = function (opts) {
    opts.command('props')
        .option('radius', {
            abbr: 'r',
            flag: true,
            help: "(default) get the PSM Server Radius Properties"
        })
        .help("Provides properties defined on the PSM Server.")
        .callback(function (opts) {
            rest.get(helper.getURL(opts) + 'ServerInfo/Properties', helper.getOptions(opts),
                function (error, data, res) {
                    if (error instanceof Error) {
                        helper.handleError(error.message);
                    } else {
                        if (res.statusCode === 200) {
                            if (opts.radius) {
                                radiusToConsole(data);
                            }
                        } else {
                            helper.not200(res, "System Properties");
                        }
                    }
                });
        });
};


