/*
 * Network Element 
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');

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
            var url = "http://" + opts.server + "/";
            if (opts.list) {
                rest.get(url + 'NetworkElements', {
                        username:opts.username,
                        password:opts.password
                    },
                    function (error, data) {
                        if (error instanceof Error) {
                            console.log(error.message);
                        } else {
                            var ipAddresses = [];
                            for (var i = 0; i < data.networkElement.length; i++) {
                                ipAddresses.push(data.networkElement[i].address);
                            }
                            console.log("Network Elements: " + ipAddresses.toString());
                        }
                    }
                );
            } else if (opts.detail) {

                console.log("Network Element detail called for " + opts.detail);
            }
        });
};