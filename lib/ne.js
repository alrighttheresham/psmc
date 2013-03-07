/*
 * Network Element 
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

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

            var client = require('./helper').getClient(opts);
            var url = "http://" + opts.server + "/";

            if (opts.list) {
                console.log("Network Element list called");
                client.get(url + "NetworkElements", function (data, response) {
                    // parsed response body as js object
                    console.log(data);
                    // raw response
                    console.log(response);
                });
            } else if (opts.detail) {
                console.log("Network Element detail called for " + opts.detail);
            }
        });
};