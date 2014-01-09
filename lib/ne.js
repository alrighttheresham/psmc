/*
 * Network Element
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');
var columnizer = require('columnizer');
var sets = require('simplesets');
var HashMap = require('hashmap').HashMap;

function reachableToConsole(data) {
    if (data.networkElement) {
        var ipAddresses = [];
        for (var i = 0; i < data.networkElement.length; i++) {
            if (!data.networkElement[i].isReachable) {
                if (data.networkElement[i].sysName.lastIndexOf("BTI", 0) === 0) {
                    ipAddresses.push(data.networkElement[i].address);
                } else {
                    ipAddresses.push(data.networkElement[i].address + " (" + data.networkElement[i].sysName + ")");
                }
            }
        }
        console.log("List of unreachable network elements (" + ipAddresses.length + "): " + ipAddresses.toString());
    }
}

var getNetworkElementListGroupByDomain = function (data, map, ipAddresses) {
    for (var i = 0; i < data.networkElement.length; i++) {
        if (!map.get(data.networkElement[i].managementDomainName)) {
            map.set(data.networkElement[i].managementDomainName, new Array(data.networkElement[i].address));
        } else {
            map.get(data.networkElement[i].managementDomainName).push(data.networkElement[i].address);
        }
        ipAddresses.push(data.networkElement[i].address);
    }
};
function listToConsole(data) {
    var map = new HashMap();
    var ipAddresses = [];
    if (data.networkElement) {
        getNetworkElementListGroupByDomain(data, map, ipAddresses);
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
    if (data.networkElement) {
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

var packsToConsole = function (data, opts) {
    if (data.shelfList) {
        var devices = new sets.Set();
        for (var i = 0; i < data.shelfList.length; i++) {
            if (data.shelfList[i].shelf) {
                for (var j = 0; j < data.shelfList[i].shelf.length; j++) {
                    if (data.shelfList[i].shelf[j].slot) {
                        for (var k = 0; k < data.shelfList[i].shelf[j].slot.length; k++) {
                            if (data.shelfList[i].shelf[j].slot[k].packShortName) {
                                if (opts.find.toUpperCase() === data.shelfList[i].shelf[j].slot[k].packShortName.toUpperCase()) {
                                    devices.add(data.shelfList[i].networkElement.address);
                                }
                            }
                        }
                    }
                }
            }
        }
        console.log("Network Elements: (" + devices.size() + ") : " + devices.array());
    }
};
function sysnameToConsole(data) {
    if (data.networkElement) {
        var ethTable = new columnizer();
        ethTable.row("IP", "Sysname");
        for (var i = 0; i < data.networkElement.length; i++) {
            ethTable.row(data.networkElement[i].address, helper.notNull(data.networkElement[i].sysName));
        }
        ethTable.print();
    }
}
function walkTimeToConsole(data) {
    if (data.networkElement) {
        var sortedList =  data.networkElement.sort(function(obj1, obj2) {
            // descending
            return obj2.snmpWalkTime - obj1.snmpWalkTime;
        });
        var walkTimeTable = new columnizer();
        walkTimeTable.row("IP", "Sysname", "SNMP Walk Time");
        for (var i = 0; i < sortedList.length; i++) {
            walkTimeTable.row(sortedList[i].address, helper.notNull(sortedList[i].sysName), sortedList[i].snmpWalkTime);
        }
        walkTimeTable.print();
    }
}
var groupsCallback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        groupsToConsole(data);
    }
};
var devicesCallback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        detailToConsole(data, opts);
    }
};
var shelfInfoCallback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        packsToConsole(data, opts);
    }
};
var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        if (opts.reachable) {
            reachableToConsole(data);
        } else if (opts.types) {
            typesToConsole(data);
        } else if (opts.sysname) {
            sysnameToConsole(data);
        } else if (opts.walktime) {
            walkTimeToConsole(data);
        } else {
            listToConsole(data);
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
        }).option('find', {
            abbr: 'f',
            metavar: 'packShortName',
            help: "search through the discovered network elements and find NEs that contains the specified pack short name, for e.g. PVX, MSA1, DTPR"
        }).option('sysname', {
            abbr: 'y',
            flag: true,
            help: "provide the sysname if present"
        }).option('walktime', {
            abbr: 'w',
            flag: true,
            help: "provides a table of the Network Elements prioritised based on snmp walk time"
        }).help("Provides a set of operations that will return information on the discovered Network Elements").callback(function (opts) {
            if (opts.groups) {
                helper.requestWithEncoding(opts, "Groups", groupsCallback);
            } else if (opts.detail) {
                helper.requestWithEncoding(opts, "Devices", devicesCallback);
            } else if (opts.find) {
                helper.requestWithEncoding(opts, "Devices/ShelfInfo", shelfInfoCallback);
            } else {
                helper.requestWithEncoding(opts, "NetworkElements", callback);
            }
        });
};


exports.listToConsole = listToConsole;
exports.groupsToConsole = groupsToConsole;
exports.typesToConsole = typesToConsole;
exports.getNetworkElementListGroupByDomain = getNetworkElementListGroupByDomain;