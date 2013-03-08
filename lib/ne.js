/*
 * Network Element 
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var helper = require('./helper');

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
            if (opts.list) {
                rest.get(helper.getURL(opts) + 'NetworkElements', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            var ipAddresses = [];
                            for (var i = 0; i < data.networkElement.length; i++) {
                                ipAddresses.push(data.networkElement[i].address);
                            }
                            console.log("Network Elements (" + ipAddresses.length + "): " + ipAddresses.toString());
                        }
                    });
            } else if (opts.detail) {
                rest.get(helper.getURL(opts) + 'Devices', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            for (var i = 0; i < data.deviceList.length; i++) {
                                if (data.deviceList[i].address === opts.detail) {
                                    console.log(data.deviceList[i]);
                                }
                            }
                        }
                    });
            } else if (opts.types) {
                rest.get(helper.getURL(opts) + 'NetworkElements', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            var map = new HashMap();
                            for (var i = 0; i < data.networkElement.length; i++) {
                                if (!map.get(data.networkElement[i].type + ":" + data.networkElement[i].version)) {
                                    map.set(data.networkElement[i].type + ":" + data.networkElement[i].version, new Array(data.networkElement[i].address));
                                } else {
                                    map.get(data.networkElement[i].type + ":" + data.networkElement[i].version).push(data.networkElement[i].address);
                                }
                            }
                            console.log("Network Elements (" + data.networkElement.length + ")");
                            map.forEach(function (value, key) {
                                console.log("\t" + key + " (" + value.length + ")" + " : " + value.toString());
                            });
                        }
                    });
            }
        });
};