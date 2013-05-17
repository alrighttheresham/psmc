/*
 * Initial System config
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var helper = require('./helper');
var system = require('./sys');
var ne = require("./ne");
var cus = require("./cus");

exports.command = function (opts) {
    opts.command('init')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) initial system config listing"
        })
        .help("Provides initial system information on the PSM Server.")
        .callback(function (opts) {
            rest.get(helper.getURL(opts) + 'ServerInfo', helper.getOptions(opts),
                function (error, data, res) {
                    if (error instanceof Error) {
                        helper.handleError(error.message);
                    } else {
                        if (res.statusCode === 200) {
                            console.log("");
                            console.log("--- System Info ---");
                            console.log("");
                            system.listToConsole(data);
                            rest.get(helper.getURL(opts) + 'NetworkElements', helper.getOptions(opts),

                                function (error, data) {
                                    if (res.statusCode === 200) {
                                        if (error instanceof Error) {
                                            helper.handleError(error.message);
                                        } else {
                                            console.log("");
                                            console.log("--- Network Elements ---");
                                            console.log("");
                                            ne.listToConsole(data);
                                            console.log("");
                                            console.log("--- Network Element Types ---");
                                            console.log("");
                                            ne.typesToConsole(data);
                                            rest.get(helper.getURL(opts) + 'Groups', helper.getOptions(opts),

                                                function (error, data) {
                                                    if (res.statusCode === 200) {
                                                        if (error instanceof Error) {
                                                            helper.handleError(error.message);
                                                        } else {
                                                            console.log("");
                                                            console.log("--- Network Elements Groups ---");
                                                            console.log("");
                                                            ne.groupsToConsole(data);
                                                            rest.get(helper.getURL(opts) + 'Customers', helper.getOptions(opts),

                                                                function (error, data) {
                                                                    if (res.statusCode === 200) {
                                                                        if (error instanceof Error) {
                                                                            helper.handleError(error.message);
                                                                        } else {
                                                                            console.log("");
                                                                            console.log("--- Customers ---");
                                                                            console.log("");
                                                                            cus.listToConsole(data);
                                                                            console.log(" ");
                                                                        }
                                                                    } else {
                                                                        helper.not200(res, "Customer Details");
                                                                    }
                                                                });
                                                        }
                                                    } else {
                                                        helper.not200(res, "Group Details");
                                                    }
                                                });
                                        }
                                    } else {
                                        helper.not200(res, "Network Element Details");
                                    }
                                });
                        } else {
                            helper.not200(res, "Server Info");
                        }
                    }
                });
        });
};