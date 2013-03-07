/*
 * System Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

exports.command = function (opts) {
    opts.command('sys')
        .option('list', {
            abbr:'l',
            flag:true,
            help:"get the PSM Server System Information"
        })
        .help("Provides information on the PSM Server.")
        .callback(function (opts) {
            if (opts.list) {
                console.log("System Info called");
            }
        });
};