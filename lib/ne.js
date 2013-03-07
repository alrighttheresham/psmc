/*
 * Network Element 
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */


 exports.command = function (opts) {
    opts.command('ne')
        .option('list', {
            abbr:'l',
            flag:true,
            help:"get the discovered list of Network Elements"
        })
        .option('detail', {
            abbr:'d',
            metavar:'IPADDR',
            help:"get detailed information on a Network Element"
        })
        .help("Provides a set of operations that will return information on the discovered Network Elements")
        .callback(function (opts) {
            if(opts.list) {
                console.log("Network Element list called");
            } else if (opts.detail) {
                console.log("Network Element detail called for " + opts.detail);
            };
        });
}