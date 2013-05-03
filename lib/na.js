/*
 * Network Alarms 
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var helper = require('./helper');

var HashMap = require('hashmap').HashMap;

var Table = require('cli-table');

var table = new Table({
    head: ['Alarm Description', 'NE', 'Source', 'Time Raised', 'Severity'], colWidths: [46, 16, 12, 31, 11]
});

function listToConsole(data) {
    var map = new HashMap();
    for (var i = 0; i < data.networkAlarm.length; i++) {
        if (!map.get(data.networkAlarm[i].severity)) {
            map.set(data.networkAlarm[i].severity, new Array(data.networkAlarm[i]));
        } else {
            map.get(data.networkAlarm[i].severity).push(data.networkAlarm[i]);
        }
    }
    console.log("Network Alarms (" + data.networkAlarm.length + ")");


    map.forEach(function (value, key) {
        console.log(key + " (" + value.length + ")");
        for (var alarm in value) {

            table.push(
                [value[alarm].description.trim(),
                    value[alarm].address.trim(),
                    value[alarm].source.trim(),
                    new Date(value[alarm].timeRaised).toUTCString(),
                    value[alarm].severity.trim()]
            );

        }
    });
    console.log(table.toString());
}
function filterToConsole(data, opts) {
    var map = new HashMap();
    for (var i = 0; i < data.networkAlarm.length; i++) {
        if (!map.get(data.networkAlarm[i].severity)) {
            map.set(data.networkAlarm[i].severity, new Array(data.networkAlarm[i]));
        } else {
            map.get(data.networkAlarm[i].severity).push(data.networkAlarm[i]);
        }
    }

    map.forEach(function (value, key) {
        if (key === opts.filter) {
            for (var alarm in value) {

                table.push(
                    [value[alarm].description.trim(),
                        value[alarm].address.trim(),
                        value[alarm].source.trim(),
                        new Date(value[alarm].timeRaised).toUTCString(),
                        value[alarm].severity.trim()]
                );

            }
        }
    });
    console.log(opts.filter + " (" + table.length + ")");
    console.log(table.toString());
}
function detailToConsole(data, opts) {
    var map = new HashMap();
    for (var i = 0; i < data.networkAlarm.length; i++) {
        if (!map.get(data.networkAlarm[i].severity)) {
            map.set(data.networkAlarm[i].severity, new Array(data.networkAlarm[i]));
        } else {
            map.get(data.networkAlarm[i].severity).push(data.networkAlarm[i]);
        }
    }

    map.forEach(function (value) {
        for (var alarm in value) {
            if (value[alarm].address.trim() === opts.detail) {
                table.push(
                    [value[alarm].description.trim(),
                        value[alarm].address.trim(),
                        value[alarm].source.trim(),
                        new Date(value[alarm].timeRaised).toUTCString(),
                        value[alarm].severity.trim()]
                );
            }
        }

    });
    console.log(opts.detail + " (" + table.length + ")");
    console.log(table.toString());
}
exports.command = function (opts) {
    opts.command('na')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) get the discovered list of Active Network Alarms"
        })
        .option('filter', {
            abbr: 'f',
            metavar: 'SEVERITY',
            choices: ['CRITICAL', 'MAJOR', 'MINOR'],
            help: "filter the list based on alarm severity"
        })
        .option('detail', {
            abbr: 'd',
            metavar: 'IPADDR',
            help: "show only the alarms for a particular network element"
        })
        .help("Provides a set of operations that will return information on the discovered Network Alarms")
        .callback(function (opts) {
            if (opts.detail) {
                rest.get(helper.getURL(opts) + 'NetworkAlarms', helper.getOptions(opts),
                    function (error, data, res) {
                        if (res.statusCode == "200") {
                            if (error instanceof Error) {
                                helper.handleError(error.message);
                            } else {
                                detailToConsole(data, opts);
                            }
                        } else {
                            helper.not200(res, "Network Alarm Details");
                        }
                    });
            } else if (opts.filter) {
                rest.get(helper.getURL(opts) + 'NetworkAlarms', helper.getOptions(opts),
                    function (error, data, res) {
                        if (res.statusCode == "200") {

                            if (error instanceof Error) {
                                helper.handleError(error.message);
                            } else {
                                filterToConsole(data, opts);
                            }
                        } else {
                            helper.not200(res, "Network Alarms Filter");
                        }
                    });
            } else {
                rest.get(helper.getURL(opts) + 'NetworkAlarms', helper.getOptions(opts),
                    function (error, data, res) {
                        if (res.statusCode == "200") {

                            if (error instanceof Error) {
                                helper.handleError(error.message);
                            } else {
                                listToConsole(data);
                            }
                        } else {
                            helper.not200(res, "Network Alarms");
                        }
                    });
            }
        });
};

