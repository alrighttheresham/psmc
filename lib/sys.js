/*
 * System Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var helper = require('./helper');

exports.command = function (opts) {
    opts.command('sys')
        .option('list', {
            abbr:'l',
            flag:true,
            help:"get the PSM Server System Information"
        })
        .help("Provides information on the PSM Server.")
        .callback(function (opts) {
            if (opts.list) {
                //console.log(helper.getURL(opts));
                //console.log(helper.getOptions(opts));
                rest.get(helper.getURL(opts) + 'ServerInfo', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            console.log("");
                            console.log("hostname: " + data.hostname);
                            console.log("address: " + data.addr);
                            console.log("");
                            console.log("widecastRelease: " + data.widecastRelease);
                            console.log("operatingSystem: " + data.operatingSystem);
                            console.log("kernelRelease: " + data.kernelRelease);
                            console.log("");
                            console.log("psm version: " + data.version);
                            console.log("psm revision: " + data.revision);
                            console.log("vmVersion: " + data.vmVersion);
                            console.log("");
                            console.log("authenticationType: " + data.authenticationType);
                            console.log("");
                            console.log("noOfCores: " + data.noOfCores);
                            console.log("memoryInGB: " + data.memoryInGB);
                            console.log("harddriveInGB: " + data.harddriveInGB);
                            console.log("");
                            console.log("serverUptime: " + helper.getDurationFromMilliSeconds(data.serverUptime));
                            console.log("psmUptime: " + helper.getDurationFromMilliSeconds(data.psmUptime));
                        }
                    });
            }
        });
};