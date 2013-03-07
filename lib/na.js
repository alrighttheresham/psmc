/*
 * Network Alarms 
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */


exports.command = function (opts) {
    opts.command('na')
        .option('list', {
            abbr:'l',
            flag:true,
            help:"get the discovered list of Network Alarms"
        })
        .option('detail', {
            abbr:'d',
            metavar:'ID',
            help:"get detailed information on a Network Alarm"
        })
        .help("Provides a set of operations that will return information on the discovered Network Alarms")
        .callback(function (opts) {
            if(opts.list) {
                console.log("Network Alarm list called");
            } else if (opts.detail) {
                console.log("Network Alarm detail called for " + opts.detail);
            };
        });
}