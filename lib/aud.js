/*
 * System Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');
var system = require('./sys');
var ne = require("./ne");
var eth = require("./eth");
var erps = require("./erps");
var meps = require("./meps");

var mepsCallback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        console.log("");
        console.log("--- MEPs Count ---");
        console.log("");
        meps.listToConsole(data);
        console.log("");
        console.log("");
        console.log("");
    }
};

var ethCallback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        console.log("");
        console.log("--- Ethernet Service Count ---");
        console.log("");
        eth.countsToConsole(data);
        console.log("");
        helper.requestWithEncoding(opts, "NetworkServices", mepsCallback);
    }
};

var erpsCallback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        console.log("");
        console.log("--- ERPS Information ---");
        console.log("");
        erps.summaryToConsole(data,opts);
        console.log("");
        helper.requestWithEncoding(opts, "NetworkServices", ethCallback);
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
        helper.requestWithEncoding(opts, "NetworkServices", erpsCallback);
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
    opts.command('aud')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) get the network audit"
        })
        .help("Provides an audit of a customers network.")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "ServerInfo", callback);
        });
};
