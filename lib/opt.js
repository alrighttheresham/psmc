/*
 * Network Element 
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

exports.command = function (opts) {
    opts.command('opt')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "get the discovered list of Optical Services"
        })
        .option('detail', {
            abbr: 'd',
            metavar: 'WAVELENGTH',
            help: "get detailed information on a Optical Service"
        })
        .help("Provides a set of operations that will return information on the discovered Optical Services")
        .callback(function (opts) {
            if (opts.list) {
                console.log("Optical Service list called - Currently N/A");
            } else if (opts.detail) {
                console.log("Optical Service detail called for " + opts.detail + " - Currently N/A");
            }
        });
};