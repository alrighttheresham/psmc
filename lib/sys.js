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

function listToConsole(data) {
    console.log("");
    console.log("hostname: " + data.hostname);
    console.log("address: " + data.ipAddress);
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
    console.log("");
    // check hw, identify if any know issues
    if (data.noOfCores < 5) {
        console.log("Warning: No of cores is less than minimum recommendation: 4");
    }
    if (data.memoryInGB < 9) {
        console.log("Warning: Memory is less than minimum recommendation: 8");
    }
    if (data.harddriveInGB < 65) {
        console.log("Warning: Harddrive is less than minimum recommendation: 65");
    }
    if (data.revision > 9629 && data.vmVersion.indexOf("1.6") === 0) {
        console.log("Warning: Java version is incorrect for version of PSM, does the OS require an update?");
    }
}


exports.command = function (opts) {
    opts.command('sys')
        .option('list', {
            abbr:'l',
            flag:true,
            help:"(default) get the PSM Server System Information"
        })
        .help("Provides information on the PSM Server.")
        .callback(function (opts) {
            if (true) {
                rest.get(helper.getURL(opts) + 'ServerInfo', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            listToConsole(data);
                        }
                    });
            }
        });
};


exports.listToConsole = listToConsole;
