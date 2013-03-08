/*
 * Network Element 
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var HashMap = require('hashmap').HashMap;

exports.command = function (opts) {
    opts.command('ne').option('list', {
        abbr: 'l',
        flag: true,
        help: "list of Network Elements, in csv format (can be used to seed a replacement psm installation)"
    }).option('types', {
            abbr: 't',
            flag: true,
            help: "list of Network Elements categorised by type"
        }).option('detail', {
            abbr: 'd',
            metavar: 'IPADDR',
            help: "detailed information on a Network Element"
        }).help("Provides a set of operations that will return information on the discovered Network Elements").callback(function (opts) {
            var url = "http://" + opts.server + "/";
            var options = {
                username: opts.username,
                password: opts.password,
                headers: {
                    'Accept': '*/*',
                    'User-Agent': 'psmc',
                    'Accept-Encoding': 'gzip'
                }
            };
            if (opts.list) {
                rest.get(url + 'NetworkElements', options,

                    function (error, data) {
                        if (error instanceof Error) {
                            console.log("Error: " + error.message);
                        } else {
                            var ipAddresses = [];
                            for (var i = 0; i < data.networkElement.length; i++) {
                                ipAddresses.push(data.networkElement[i].address);
                            }
                            console.log("Network Elements (" + ipAddresses.length + "): " + ipAddresses.toString());
                        }
                    });
            } else if (opts.detail) {
                rest.get(url + 'Devices', options,

                    function (error, data) {
                        if (error instanceof Error) {
                            console.log("Error: " + error.message);
                        } else {
                            for (var i = 0; i < data.deviceList.length; i++) {
                                if (data.deviceList[i].address === opts.detail) {
                                    console.log(data.deviceList[i]);
                                }
                            }
                        }
                    });
            } else if (opts.types) {
                rest.get(url + 'NetworkElements', options,

                    function (error, data) {
                        if (error instanceof Error) {
                            console.log("Error: " + error.message);
                        } else {
                            var map = new HashMap();
                            for (var i = 0; i < data.networkElement.length; i++) {
                                if (!map.get(data.networkElement[i].type)) {
                                    map.set(data.networkElement[i].type, new Array(data.networkElement[i].address));
                                } else {
                                    map.get(data.networkElement[i].type).push(data.networkElement[i].address);
                                }
                            }
                            map.forEach(function(value, key) {
                                console.log(key + " (" + value.length + ")"+ " : " + value.toString());
                            });
                        }
                    });
            }
        });
};