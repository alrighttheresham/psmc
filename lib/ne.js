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

function reachableToConsole(data) {
    if (data.networkElement) {
        var ipAddresses = [];
        for (var i = 0; i < data.networkElement.length; i++) {
            if (!data.networkElement[i].isReachable) {
                ipAddresses.push(data.networkElement[i].address);
            }
        }
        console.log("List of unreachable network elements: " + ipAddresses.toString());
    }
}

function listToConsole(data) {
    var map = new HashMap();
    var ipAddresses = [];
    if (data.networkElement) {
        for (var i = 0; i < data.networkElement.length; i++) {
            if (!map.get(data.networkElement[i].managementDomainName)) {
                map.set(data.networkElement[i].managementDomainName, new Array(data.networkElement[i].address));
            } else {
                map.get(data.networkElement[i].managementDomainName).push(data.networkElement[i].address);
            }
            ipAddresses.push(data.networkElement[i].address);
        }
        console.log("Network Elements: (" + data.networkElement.length + ") : " + ipAddresses.toString());
        map.forEach(function (value, key) {
            console.log("Domain: " + key + " (" + value.length + ") : " + value.toString());
        });
    }
}
function detailToConsole(data, opts) {
    for (var i = 0; i < data.deviceList.length; i++) {
        if (data.deviceList[i].address === opts.detail || data.deviceList[i].sysName === opts.detail) {
            console.log(data.deviceList[i]);
        }
    }
}
function typesToConsole(data) {
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
var rootCheck = function (message) {
    if (message === "root" || message === "ROOT") {
        message = "N/A";
    }
    return message;
};
var g = function (containedGroupList) {
    if (containedGroupList.length === 0) {
        return;
    }
    for (var i = 0; i < containedGroupList.length; i++) {
        var devices = [];
        for (var j = 0; j < containedGroupList[i].groupMemberList.length; j++) {
            if (containedGroupList[i].groupMemberList[j].type === "DEVICE") {
                devices.push(containedGroupList[i].groupMemberList[j].name);
            }
        }

        console.log("Parent: [" + rootCheck(containedGroupList[i].parentName) + "] - Name: [" + rootCheck(containedGroupList[i].name) + "] (" + devices.length + ") " + devices.toString());
        g(containedGroupList[i].containedGroupList);
    }
};
var groupsToConsole = function (data) {
    if (data.group) {
        for (var i = 0; i < data.group.length; i++) {
            var devices = [];
            for (var j = 0; j < data.group[i].groupMemberList.length; j++) {
                if (data.group[i].groupMemberList[j].type === "DEVICE") {
                    devices.push(data.group[i].groupMemberList[j].name);
                }
            }
            console.log("Parent: [" + rootCheck(data.group[i].parentName) + "] - Name: [" + rootCheck(data.group[i].name) + "] (" + devices.length + ") " + devices.toString());
            g(data.group[i].containedGroupList);
        }
    }
};
exports.command = function (opts) {
    opts.command('ne').option('list', {
        abbr: 'l',
        flag: true,
        help: "(default) list of Network Elements, in csv format (can be used to seed a replacement psm installation)"
    }).option('types', {
            abbr: 't',
            flag: true,
            help: "list of Network Elements categorised by type"
        }).option('groups', {
            abbr: 'g',
            flag: true,
            help: "list of Network Elements categorised by group"
        }).option('reachable', {
            abbr: 'r',
            flag: true,
            help: "list of unreachable Network Elements"
        }).option('detail', {
            abbr: 'd',
            metavar: 'IPADDR|SYSNAME',
            help: "detailed information on a Network Element, selected on ip address or sysname"
        }).help("Provides a set of operations that will return information on the discovered Network Elements").callback(function (opts) {
            if (opts.groups) {
                rest.get(helper.getURL(opts) + 'Groups', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            groupsToConsole(data);
                        }
                    });
            } else if (opts.reachable) {
                rest.get(helper.getURL(opts) + 'NetworkElements', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            reachableToConsole(data);
                        }
                    });
            } else if (opts.detail) {
                rest.get(helper.getURL(opts) + 'Devices', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            detailToConsole(data, opts);
                        }
                    });
            } else if (opts.types) {
                rest.get(helper.getURL(opts) + 'NetworkElements', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            typesToConsole(data);
                        }
                    });
            } else {
                rest.get(helper.getURL(opts) + 'NetworkElements', helper.getOptions(opts),

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
exports.groupsToConsole = groupsToConsole;
