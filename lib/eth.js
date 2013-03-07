/*
 * Network Element 
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

exports.command = function (opts) {
    opts.command('eth')
        .option('list', {
            abbr:'l',
            flag:true,
            help:"get the discovered list of Ethernet Services"
        })
        .option('detail', {
            abbr:'d',
            metavar:'VLAN',
            help:"get detailed information on a Ethernet Service"
        })
        .help("Provides a set of operations that will return information on the discovered Ethernet Services")
        .callback(function (opts) {
            if(opts.list) {
                console.log("Ethernet Service list called");
            } else if (opts.detail) {
                console.log("Ethernet Service detail called for " + opts.detail);
            }
        });
};