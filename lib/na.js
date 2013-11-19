/*
 * Network Alarms 
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');
var HashMap = require('hashmap').HashMap;
var Columnizer = require('columnizer');


var alarmTable = new Columnizer();
alarmTable.row("Alarm Description", "NE", "Source", "Time Raised", "Severity");

function listToConsole(data) {
    var map = new HashMap();
    for (var i = 0; i < data.networkAlarm.length; i++) {
        if (!map.get(data.networkAlarm[i].severity)) {
            map.set(data.networkAlarm[i].severity, new Array(data.networkAlarm[i]));
        } else {
            map.get(data.networkAlarm[i].severity).push(data.networkAlarm[i]);
        }
    }
    console.log(" ");
    console.log("NETWORK ALARMS (" + data.networkAlarm.length + ")");


    map.forEach(function (value, key) {
        console.log(" ");
        console.log(key + " (" + value.length + ")");
        console.log(" ");
        for (var alarm in value) {
            alarmTable.row(
                value[alarm].description.trim().substr(0,46),
                    value[alarm].address.trim(),
                    value[alarm].source.trim(),
                    new Date(value[alarm].timeRaised).toUTCString(),
                    value[alarm].severity.trim()
            );
        }
        alarmTable.print();
        alarmTable = new Columnizer();
        alarmTable.row("Alarm Description", "NE", "Source", "Time Raised", "Severity");
    });
}
function filterToConsole(data, opts) {
    console.log(" ");
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
                alarmTable.row(
                    value[alarm].description.trim().substr(0,46),
                        value[alarm].address.trim(),
                        value[alarm].source.trim(),
                        new Date(value[alarm].timeRaised).toUTCString(),
                        value[alarm].severity.trim()
                );

            }
        }
    });
    alarmTable.print();
}
function recentToConsole(data, opts) {
    console.log(" ");
    var alarms = [];
    var dateOffset = ((60*1000) * opts.recent);
    var myDate = new Date();
    myDate.setTime(myDate.getTime() - dateOffset);
    for (var i = 0; i < data.networkAlarm.length; i++) {
        var raisedDate = new Date(data.networkAlarm[i].timeRaised);
        if (raisedDate.getTime() > myDate.getTime() ) {
            alarms.push(data.networkAlarm[i]);
        }
    }

    for (var j = 0; j < alarms.length; j++) {
        //"Alarm Description", "NE", "Source", "Time Raised", "Severity"
        alarmTable.row(
            alarms[j].description.trim().substr(0,46),
            alarms[j].address.trim(),
            alarms[j].source.trim(),
            new Date(alarms[j].timeRaised).toUTCString(),
            alarms[j].severity.trim()
        );
    }
    alarmTable.print();
}
function detailToConsole(data, opts) {
    console.log(" ");
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
                alarmTable.row(
                    value[alarm].description.trim().substr(0,46),
                        value[alarm].address.trim(),
                        value[alarm].source.trim(),
                        new Date(value[alarm].timeRaised).toUTCString(),
                        value[alarm].severity.trim()
                );
            }
        }

    });
    alarmTable.print();
}

var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        if (opts.detail) {
            detailToConsole(data, opts);
        } else if (opts.filter) {
            filterToConsole(data, opts);
        } else if (opts.recent) {
            recentToConsole(data, opts);
        } else {
            listToConsole(data);
        }
    }
};

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
        }).option('recent', {
            abbr: 'r',
            metavar: 'MINS',
            help: "filter the list based on the last N minutes"
        })
        .option('detail', {
            abbr: 'd',
            metavar: 'IPADDR',
            help: "show only the alarms for a particular network element"
        })
        .help("Provides a set of operations that will return information on the discovered Network Alarms")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "NetworkAlarms", callback);
        });
};

