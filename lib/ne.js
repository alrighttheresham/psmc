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


function listToConsole(data) {
    var map = new HashMap();
    var ipAddresses = [];
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
function detailToConsole(data, opts) {
    for (var i = 0; i < data.deviceList.length; i++) {
        if (data.deviceList[i].address === opts.detail) {
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
var g = function (containedGroupList) {
    if (containedGroupList.length == 0) {
        return;
    }
    for (var i = 0; i < containedGroupList.length; i++) {
        var devices = [];
        for (var j = 0; j < containedGroupList[i].groupMemberList.length; j++) {
            devices.push(containedGroupList[i].groupMemberList[j].name);
        }
        if (containedGroupList[i].name === "ROOT") {
            console.log("Parent: [N/A] - ");
        } else {
            var parent = containedGroupList[i].parentName;
            if (containedGroupList[i].parentName === "ROOT") {
                parent = "N/A";
            } else {
            }
            console.log("Parent: [" + parent + "] - Name: [" + containedGroupList[i].name + "] (" + devices.length + ") " + devices.toString());

        }
        g(containedGroupList[i].containedGroupList);
    }
}
var groupsToConsole = function (data) {
    for (var i = 0; i < data.group.length; i++) {
        var devices = [];
        for (var j = 0; j < data.group[i].groupMemberList.length; j++) {
            devices.push(data.group[i].groupMemberList[j].name);
        }
        console.log("Parent: [N/A] - Name: [N/A] (" + devices.length + ") " + devices.toString());
        g(data.group[i].containedGroupList);
    }
}
exports.command = function (opts) {
    opts.command('ne').option('list', {
        abbr: 'l',
        flag: true,
        help: "list of Network Elements, in csv format (can be used to seed a replacement psm installation)"
    }).option('types', {
            abbr: 't',
            flag: true,
            help: "list of Network Elements categorised by type"
        }).option('groups', {
            abbr: 'g',
            flag: true,
            help: "list of Network Elements categorised by group"
        }).option('detail', {
            abbr: 'd',
            metavar: 'IPADDR',
            help: "detailed information on a Network Element"
        }).help("Provides a set of operations that will return information on the discovered Network Elements").callback(function (opts) {
            if (opts.list) {
                rest.get(helper.getURL(opts) + 'NetworkElements', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            listToConsole(data);
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
            } else if (opts.groups) {
                rest.get(helper.getURL(opts) + 'Groups', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            groupsToConsole(data);
                        }
                    });
            }
        });
};


exports.listToConsole = listToConsole;
exports.groupsToConsole = groupsToConsole;