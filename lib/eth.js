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

function handleNoCustomer(key) {
    if (key === null) {
        key = "No Customer Assigned";
    }
    return key;
}


function listToConsole(data) {
    var map = new HashMap();
    for (var i = 0; i < data.networkService.length; i++) {
        if (!map.get(handleNoCustomer(data.networkService[i].customer))) {
            map.set(handleNoCustomer(data.networkService[i].customer), new Array(data.networkService[i]));
        } else {
            map.get(handleNoCustomer(data.networkService[i].customer)).push(data.networkService[i]);
        }
    }
    console.log("Ethernet Services (" + data.networkService.length + ")");
    map.forEach(function (value, key) {
        console.log(key + " (" + value.length + ")");
        for (var service in value) {
            console.log("\t" + helper.spaceFill(value[service].id, 4), helper.spaceFill(value[service].type, 15), "\t" + value[service].managementDomainName);
        }
    });
}
function alarmedToConsole(data) {
    if(data.networkService) {
        for (var i = 0; i < data.networkService.length; i++) {
            if ((data.networkService[i].affectingAlarms.critical !== 0)) {
                var affectingAlarms = data.networkService[i].affectingAlarms;
                console.log(helper.spaceFill(data.networkService[i].id, 4), helper.spaceFill(data.networkService[i].type, 15), "\t" + helper.spaceFill(data.networkService[i].managementDomainName, 15) +
                            "\t\tminor(" + affectingAlarms.minor + ") " +
                            "major(" + affectingAlarms.major + ") " +
                            "critical(" + affectingAlarms.critical + ") " +
                            "acked(" + affectingAlarms.acked + ") " +
                            "total(" + affectingAlarms.total + ")");
                for (var j = 0; j < data.networkService[i].affectingAlarms.alarmSource.length; j++) {
                    var alarmSource = data.networkService[i].affectingAlarms.alarmSource[j].networkAlarm;
                    if (alarmSource.severity === "CRITICAL" && alarmSource.acknowledged === false) {
                        console.log(helper.spaceFill(alarmSource.description, 46) +
                                    helper.spaceFill(alarmSource.address, 16) +
                                    helper.spaceFill(alarmSource.source, 20) +
                                    helper.spaceFill(new Date(alarmSource.timeRaised).toUTCString(), 31));
                    }
                }
            }
        }
    }
}
function detailToConsole(data, opts) {
    if(data.networkService) {
        for (var i = 0; i < data.networkService.length; i++) {
            if (data.networkService[i].id === opts.detail) {
                var addresses = [];
                for (var j = 0; j < data.networkService[i].serviceNetworkElements.length; j++) {
                    addresses.push(data.networkService[i].serviceNetworkElements[j].ipAddress);
                }

                var affectingAlarms = data.networkService[i].affectingAlarms;

                console.log("vlan: " + data.networkService[i].id);
                console.log("name: " + helper.notNull(data.networkService[i].name));
                console.log("type: " + data.networkService[i].type);

                console.log("customer: " + handleNoCustomer(data.networkService[i].customer));
                console.log("management domain: " + data.networkService[i].managementDomainName);
                console.log("default frame size: " + helper.notNull(data.networkService[i].frameSize));
                console.log("operational status: " + data.networkService[i].operState);
                console.log("service alarms: " +
                            "minor(" + affectingAlarms.minor + ") " +
                            "major(" + affectingAlarms.major + ") " +
                            "critical(" + affectingAlarms.critical + ") " +
                            "acked(" + affectingAlarms.acked + ") " +
                            "total(" + affectingAlarms.total + ")");
                console.log("network elements: " + helper.notNull(addresses.toString()));
            }
        }
    }
}
exports.command = function (opts) {
    opts.command('eth')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) get the discovered list of Ethernet Services"
        })
        .option('detail', {
            abbr: 'd',
            metavar: 'VLAN',
            help: "get detailed information on a Ethernet Service"
        })
        .option('alarmed', {
            abbr: 'a',
            flag: true,
            help: "get a list of CRITICAL alarmed Ethernet Services"
        })
        .help("Provides a set of operations that will return information on the discovered Ethernet Services")
        .callback(function (opts) {
            if (opts.alarmedToConsole) {
                rest.get(helper.getURL(opts) + 'NetworkServices', helper.getOptions(opts),
                         function (error, data) {
                             if (error instanceof Error) {
                                 helper.handleError(error.message);
                             } else {
                                 alarmedToConsole(data);
                             }
                         });
            } else if (opts.detail) {
                rest.get(helper.getURL(opts) + 'NetworkServices', helper.getOptions(opts),
                         function (error, data) {
                             if (error instanceof Error) {
                                 helper.handleError(error.message);
                             } else {
                                 detailToConsole(data, opts);
                             }
                         });
            } else {
                rest.get(helper.getURL(opts) + 'NetworkServices', helper.getOptions(opts),
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