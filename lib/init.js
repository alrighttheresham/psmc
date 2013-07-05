/*
 * Initial System config
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');
var system = require('./sys');
var ne = require("./ne");
var cus = require("./cus");


var customersCallback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        console.log("");
        console.log("--- Customers ---");
        console.log("");
        cus.listToConsole(data);
        console.log(" ");
    }
};

var groupsCallback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        console.log("");
        console.log("--- Network Elements Groups ---");
        console.log("");
        ne.groupsToConsole(data);
        helper.requestWithEncoding(opts, "Customers", customersCallback);
    }
};


var networkElementsCallback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        console.log("");
        console.log("--- Network Elements ---");
        console.log("");
        ne.listToConsole(data);
        console.log("");
        console.log("--- Network Element Types ---");
        console.log("");
        ne.typesToConsole(data);
        helper.requestWithEncoding(opts, "Groups", groupsCallback);
    }
};

var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        console.log("");
        console.log("--- System Info ---");
        console.log("");
        system.listToConsole(data);
        helper.requestWithEncoding(opts, "NetworkElements", networkElementsCallback);
    }
};

exports.command = function (opts) {
    opts.command('init')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) initial system config listing"
        })
        .help("Provides initial system information on the PSM Server.")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "ServerInfo", callback);
        });
};