/*
 * Network Element
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var columnizer = require('columnizer');
var sets = require('simplesets');
var helper = require('./helper');

var HashMap = require('hashmap').HashMap;

function handleNoCustomer(key) {
    if (key === null) {
        key = "No Customer Assigned";
    }
    return key;
}

function neToConsole(data, opts) {
    if (data.networkService) {
        var services = [];
        for (var i = 0; i < data.networkService.length; i++) {
            for (var j = 0; j < data.networkService[i].serviceNetworkElements.length; j++) {
                if (data.networkService[i].serviceNetworkElements[j].ipAddress === opts.ne) {
                    services.push(data.networkService[i].id);
                }
            }
        }
        console.log("vlans (" + services.length + "): " + services.toString());
    }
}
exports.neToConsole = neToConsole;

function listToConsole(data) {
    if (data.networkService) {
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
            console.log(" ");
            console.log(key + " (" + value.length + ")");
            var ethTable = new columnizer();
            ethTable.row("VLAN", "Name", "Type", "Domain");
            for (var service in value) {
                ethTable.row(value[service].id, helper.notNull(value[service].name), value[service].type, value[service].managementDomainName);
            }
            ethTable.print();
        });
    }
}
function domainCountToConsole(data) {
    if (data.networkService) {
        var map = new HashMap();
        for (var i = 0; i < data.networkService.length; i++) {
            if (!map.get(data.networkService[i].managementDomainName)) {
                map.set((data.networkService[i].managementDomainName), 1);
            } else {
                map.set(data.networkService[i].managementDomainName, map.get(data.networkService[i].managementDomainName)+1);
            }
        }
        console.log("Total Ethernet Services (" + data.networkService.length + ")");
        map.forEach(function (value, key) {
            console.log(key + " (" + value + ")");
        });
    }
}
function alarmedToConsole(data) {
    if (data.networkService) {
        for (var i = 0; i < data.networkService.length; i++) {
            if ((data.networkService[i].affectingAlarms.critical !== 0)) {
                var affectingAlarms = data.networkService[i].affectingAlarms;
                var sources = [];
                for (var j = 0; j < data.networkService[i].affectingAlarms.alarmSource.length; j++) {
                    var alarmSource = data.networkService[i].affectingAlarms.alarmSource[j].networkAlarm;
                    if (alarmSource.severity === "CRITICAL" && alarmSource.acknowledged === false && alarmSource.description !== "Circuit pack missing.") {
                        sources.push(alarmSource);
                    }
                }
                if (sources.length > 0) {
                    console.log(helper.spaceFill(data.networkService[i].id, 4), helper.spaceFill(data.networkService[i].type, 15), helper.spaceFill(helper.notNull(data.networkService[i].name), 20), "\t" + helper.spaceFill(data.networkService[i].managementDomainName, 15) +
                        "\t\tminor(" + affectingAlarms.minor + ") " +
                        "major(" + affectingAlarms.major + ") " +
                        "critical(" + affectingAlarms.critical + ") " +
                        "acked(" + affectingAlarms.acked + ") " +
                        "total(" + affectingAlarms.total + ")");
                    for (var k = 0; k < sources.length; k++) {
                        console.log(helper.spaceFill(sources[k].description, 46) +
                            helper.spaceFill(sources[k].address, 16) +
                            helper.spaceFill(sources[k].source, 20) +
                            helper.spaceFill(new Date(sources[k].timeRaised).toUTCString(), 31));
                    }
                }
            }
        }
    }
}
function detailToConsole(data, opts) {
    if (data.networkService) {
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
                console.log("network elements: (" + addresses.length + ") " + helper.notNull(addresses.toString()));
            }
        }
    }
}
function loadedToConsole(data) {
    if (data.networkService) {
        var map = new HashMap();
        for (var i = 0; i < data.networkService.length; i++) {
            for (var j = 0; j < data.networkService[i].serviceNetworkElements.length; j++) {
                var networkElement = data.networkService[i].serviceNetworkElements[j].ipAddress;
                if (!map.get(networkElement)) {
                    map.set(networkElement, new sets.Set([data.networkService[i].id]));
                } else {
                    map.get(networkElement).add(data.networkService[i].id);
                }
            }
        }

        var unordered = [];
        map.forEach(function (value, key) {
            //console.log(key + " (" + value.size() + ")");
            var obj = { k: key, v: value.size()};
            unordered.push(obj);
        });
        unordered = unordered.sort(function (a, b) {
            if (a.v === b.v) {
                return 0;
            } else if (a.v < b.v) {
                return -1;
            } else {
                return 1;
            }
        });
        var loadedTable = new columnizer();
        loadedTable.row("Network Element", "No of Services");
        for (var row in unordered) {
            loadedTable.row(unordered[row].k, unordered[row].v);
        }
        loadedTable.print();
    }
}

function portToString(port) {
    if (port.type === "LAG") {
        return port.type + " " + port.index;
    }
    return port.type + " " + port.shelfIndex + "/" + port.slotIndex + "/" + port.index;
}

function explodeCvlans(cvlansList) {
    var list = [];

    for (var x = 0; x < cvlansList.length; x++) {
        var cvlans = cvlansList[x];

        var from = cvlans.fromVlanId;
        var to = from;
        if (cvlans.toVlanId != null) {
            to = cvlans.toVlanId;
        }

        for (var cvlan = from; cvlan <= to; cvlan++) {
            list.push(cvlan);
        }
    }

    return list;
}

function unisToConsole(data) {
    if (data.networkService) {
        var cvlansMap = new HashMap();
        var servicesMap = new HashMap();

        for (var i = 0; i < data.networkService.length; i++) {
            for (var j = 0; j < data.networkService[i].serviceNetworkElements.length; j++) {
                var serviceNetworkElement = data.networkService[i].serviceNetworkElements[j];
                var ipAddress = serviceNetworkElement.ipAddress;
                for (var k = 0; k < data.networkService[i].serviceNetworkElements[j].switchList.length; k++) {
                    for (var l = 0; l < data.networkService[i].serviceNetworkElements[j].switchList[k].servicePortList.length; l++) {
                        var servicePort = data.networkService[i].serviceNetworkElements[j].switchList[k].servicePortList[l];

                        var port = servicePort.portReference;
                        var type = servicePort.type;
                        if(servicePort.port != null) {
                            port = servicePort.port;
                            type = servicePort.port.l2Type;
                        }

                        if (type === "UNI") {
                            var portIndex = ipAddress + " " + portToString(port);
                            var cvlans = explodeCvlans(servicePort.cvlanMappingList);

                            if (!cvlansMap.get(portIndex)) {
                                cvlansMap.set(portIndex, new sets.Set(cvlans));
                            } else {
                                for (var x = 0; x < cvlans.length; x++) {
                                    cvlansMap.get(portIndex).add(cvlans[x]);
                                }
                            }

                            if (!servicesMap.get(portIndex)) {
                                servicesMap.set(portIndex, 1);
                            } else {
                                var count = servicesMap.get(portIndex) + 1;
                                servicesMap.set(portIndex, count);
                            }
                        }
                    }
                }
            }
        }

        cvlansMap.forEach(function (value, key) {
            var services = servicesMap.get(key);
            console.log(key + " (" + services + " Service(s), " + value.size() + " CVLAN(s))");
            if (value.size() > 0) {
                var cvlansArray = value.array();
                cvlansArray.sort();
                console.log("    " + cvlansArray);
            }
        });
    }
}

var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        if (opts.alarmed) {
            alarmedToConsole(data);
        } else if (opts.ne) {
            neToConsole(data, opts);
        } else if (opts.detail) {
            detailToConsole(data, opts);
        } else if (opts.loaded) {
            loadedToConsole(data);
        } else if (opts.cvlans) {
            unisToConsole(data);
        }  else if (opts.domains) {
            domainCountToConsole(data);
        } else {
            listToConsole(data);
        }
    }
};

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
        .option('ne', {
            abbr: 'n',
            metavar: 'IPADDR',
            help: "get a list services that traverse over an Network Element"
        })
        .option('loaded', {
            abbr: 'l',
            flag: true,
            help: "rank the network elements by No of provisioned services"
        })
        .option('cvlans', {
            abbr: 'c',
            flag: true,
            help: "get a list of UNIs in services and the CVLANs on them"
        })
        .option('domains', {
            abbr: 'm',
            flag: true,
            help: "provide a count of services in each domain"
        })
        .help("Provides a set of operations that will return information on the discovered Ethernet Services")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "NetworkServices", callback);
        });
};
