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
var Table = require('cli-table');

function handleNoCustomer(key) {
    if (key === null) {
        key = "No Customer Assigned";
    }
    return key;
}


var listTable = new Table({
    head: ['Customer', 'vlan', 'type', 'mgmt domain'], colWidths: [30, 20, 20, 20]
});

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
            listTable.push(
                [key, helper.spaceFill(value[service].id, 4), value[service].type, value[service].managementDomainName]
            );
        }
    });
    console.log(listTable.toString());
}
function detailToConsole(data, opts) {
    for (var i = 0; i < data.networkService.length; i++) {
        if (data.networkService[i].id === opts.detail) {
            var table = new Table();
            var addresses = [];
            for (var j = 0; j < data.networkService[i].serviceNetworkElements.length; j++) {
                addresses.push(data.networkService[i].serviceNetworkElements[j].ipAddress);
            }

            table.push(
                { 'vlan': helper.spaceFill(data.networkService[i].id, 4) }
                , { 'type': helper.notNull(data.networkService[i].type) }
                , { 'customer': handleNoCustomer(data.networkService[i].customer)}
                , { 'management domain': helper.notNull(data.networkService[i].managementDomainName)}
                , { 'default frame size': helper.notNull(data.networkService[i].frameSize)}
                , { 'operational status': helper.notNull(data.networkService[i].operState)}
                , { 'service alarms': helper.notNull(data.networkService[i].affectingAlarms.total)}
                , { 'network elements': "(" + addresses.length + ") " + helper.notNull(addresses.toString())}

            );

            console.log(table.toString());
        }
    }
}
exports.command = function (opts) {
    opts.command('eth')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "get the discovered list of Ethernet Services"
        })
        .option('detail', {
            abbr: 'd',
            metavar: 'VLAN',
            help: "get detailed information on a Ethernet Service"
        })
        .help("Provides a set of operations that will return information on the discovered Ethernet Services")
        .callback(function (opts) {
            if (opts.list) {
                rest.get(helper.getURL(opts) + 'NetworkServices', helper.getOptions(opts),
                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            listToConsole(data);
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
            }
        });
};