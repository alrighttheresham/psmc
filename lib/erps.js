/*
 * ERPS Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');
var columnizer = require('columnizer');
var database = require("./database");
var dateFormat = require('dateformat');

function portRoleToString(role) {
    if (role) {
        return "rpl port";
    }
    return "normal";
}
exports.portRoleToString = portRoleToString;

function serviceStateToString(state) {
    if (state === "PROTECTION") {
        return "protecting";
    } else if (state === "IDLE") {
        return "idle";
    } else if (state === "FORCE_SWITCH") {
        return "force switch";
    } else if (state === "MANUAL_SWITCH") {
        return "manual switch";
    } else if (state === "PENDING") {
        return "pending";
    } else if (state === "DISABLE") {
        return "disable";
    }
    return state;
}
exports.serviceStateToString = serviceStateToString;

function linkStateToString(local, remote) {
    if (local === "FAILED") {
        return "signal fail";
    } else if (remote === "FAILED") {
        return "remote signal fail";
    }
    return "normal";
}
exports.linkStateToString = linkStateToString;

function portStateToString(state) {
    if (state === "UNBLOCKED") {
        return "unblocked";
    } else if (state === "BLOCKING") {
        return "blocked";
    } else if (state == null) {
        return "undefined";
    }
    return state;
}
exports.portStateToString = portStateToString;

function portToString(sp) {
    var port = sp.port;
    if(sp.port == null) {
        port = sp.portReference;
    }
    var result = '';

    if(port.type === "LAG") {
        result += port.type + " " + port.index;
    } else {
        result += port.type + " " + port.shelfIndex + "/" + port.slotIndex + "/" + port.index;
    }
    
    if(sp.currentStatus === 'DYNAMIC') {
        result += ' (GVRP)';
    }
    
    return result;
}

function getServiceName(ss) {
    if(ss.serviceName != null) {
        return ss.serviceName;
    }
    return "";
}

function getErpsServices(data, opts) {
    var list = [];
    for (var i = 0; i < data.networkService.length; i++) {
        if (data.networkService[i].type === 'ERPS' && (opts.domain == null || data.networkService[i].managementDomainName === opts.domain)) {
            list.push(data.networkService[i]);
        }
    }
    return list;
}

function getCurrentRingState(service) {
    var states = [];
    for (var j = 0; j < service.serviceNetworkElements.length; j++) {
        var sne = service.serviceNetworkElements[j];
        for (var k = 0; k < sne.switchList.length; k++) {
            var ss = sne.switchList[k];
            if(ss.erpsSettings != null) {
                var state = serviceStateToString(ss.erpsSettings.operStatus);
                if(states.indexOf(state) === -1) {
                    states.push(state);
                }
            }
        }
    }
    return states.join();
}
                

function summaryToConsole(data, opts) {
    if (data.networkService) {
        var erpsServicesList = getErpsServices(data, opts);
        var erps = new columnizer();
        erps.row("Service Name", "SVLAN", "Domain", "Current State");
        for (var j = 0; j < erpsServicesList.length; j++) {
            var service = erpsServicesList[j];
            erps.row(service.name, service.id, service.managementDomainName, getCurrentRingState(service));
        }
        erps.print();
    }
}

function serviceSwitchDetailToConsole(erps, sne, ss) {
    if(ss.servicePortList.length === 0) {
        erps.row(sne.ipAddress, ss.index + ' (' + ss.serviceType + ')', getServiceName(ss), "[NO PORTS]", "", "", "", "");
    } else {
        for (var l = 0; l < ss.servicePortList.length; l++) {
            var sp = ss.servicePortList[l];
            if (ss.erpsSettings && sp.erpsSettings) {
                erps.row(sne.ipAddress, ss.index, getServiceName(ss), portToString(sp),
                    serviceStateToString(ss.erpsSettings.operStatus),
                    portRoleToString(sp.erpsSettings.rplPort),
                    portStateToString(sp.erpsSettings.portStatus),
                    linkStateToString(sp.erpsSettings.linkStatus, sp.erpsSettings.remoteLinkStatus));
            } else {
                erps.row(sne.ipAddress, ss.index + ' (' + ss.serviceType + ')', getServiceName(ss), portToString(sp),  
                    "",
                    "",
                    "",
                    "");
            }
        }
    }
}

function detailToConsole(data, opts) {
    if (data.networkService) {
        var erpsServicesList = getErpsServices(data, opts);
        for (var i = 0; i < erpsServicesList.length; i++) {
            if (erpsServicesList[i].id === opts.vlan) {
                var service = erpsServicesList[i];

                console.log("ERPS Service " + service.name + " (SVLAN " + service.id + ") in Domain '" + service.managementDomainName + "'");

                var erps = new columnizer();
                erps.row("Network Element", "Switch", "Service Name", "Port", "Service State", "Port Role", "Port State", "Link State");

                for (var j = 0; j < service.serviceNetworkElements.length; j++) {
                    var sne = service.serviceNetworkElements[j];
                    for (var k = 0; k < sne.switchList.length; k++) {
                        var ss = sne.switchList[k];
                        serviceSwitchDetailToConsole(erps, sne, ss);
                    }
                }

                erps.print();
            }
        }
    }
}

function getElementsInService(service) {
    var list = [];
    for (var j = 0; j < service.serviceNetworkElements.length; j++) {
        var sne = service.serviceNetworkElements[j];
        list.push(sne.ipAddress);
    }
    return list;
}

function getTrapCountForService(rows, service) {
    var elementsInService = getElementsInService(service);
    var serviceName = service.name;
    
    var count = 0;
    
    for(var j = 0; j < rows.length; j++) {
        var row = rows[j];
        if(row.value === serviceName && elementsInService.indexOf(row.deviceAddress) !== -1) {
            count++;
        }
    }
    
    return count;
}

function statesToConsoleWithNotifications(rows, erpsServicesList) {
    var erps = new columnizer();
    erps.row("Service Name", "SVLAN", "Domain", "Current State", "State Changes");
    for (var j = 0; j < erpsServicesList.length; j++) {
        var service = erpsServicesList[j];
        erps.row(service.name, service.id, service.managementDomainName, getCurrentRingState(service), getTrapCountForService(rows, service));
    }
    erps.print();

    database.disconnect();
}

 function getDate(minutes) {
    var now = new Date();
    now.setMinutes(now.getMinutes() - minutes);
    return dateFormat(now, "yyyy-mm-dd HH:MM");
}

function statesToConsole(data, opts) {
    if (data.networkService) {
        database.connect(opts);
        
        var lastMinutes = 0;
        if(opts.last != null) {
            lastMinutes = opts.last;
        }
        
        var lastMinutesDate = '';
        if(lastMinutes > 0) {
            lastMinutesDate = getDate(lastMinutes);
        }
        
        var erpsServicesList = getErpsServices(data, opts);
        database.getTrapDetailsForTrap("1.3.6.1.4.1.18070.2.2.2.1.29.0.1", lastMinutesDate, statesToConsoleWithNotifications, erpsServicesList);
    }
}

var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        if (opts.vlan) {
            detailToConsole(data, opts);
        } else if(opts.protection) {
            statesToConsole(data, opts);
        } else {
            summaryToConsole(data, opts);
        }
    }
};

exports.command = function (opts) {
    opts.command('erps')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) get a list of erps services"
        })
        .option('vlan', {
            abbr: 'v',
            metvar: 'VLAN',
            help: "get details of all erps services with provided vlan"
        })
        .option('domain', {
            abbr: 'd',
            metvar: 'DOMAIN',
            help: "get details of an erps service with provided vlan and domain"
        })
        .option('protection', {
            abbr: 'p',
            flag: true,
            help: "a list of state changes that occurred on each ring in the system (if any)"
        })
        .option('last', {
            abbr: 'l',
            metvar: 'MINUTES',
            help: "state changes in last [MINUTES] minutes"
        })
        .help("Provides information on erps services.")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "NetworkServices", callback);
        });
};
