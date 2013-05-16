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
var columnizer = require('columnizer');

/**
 * [damianoneill psmclient]$ GET /TrapReceivers | jq .
 {
   "trapReceiver": [
     {
       "community": "community",
       "port": 4000,
       "ipAddress": "127.0.0.1",
       "id": 1,
       "filters": {
         "filter": [
           {
             "join": "AND",
             "field": "DESCRIPTION",
             "operator": "EQUALS",
             "value": "damian",
             "id": 1
           }
         ]
       }
     }
   ]
 }
 * @param data
 */

function getTrapReceiver(trapReceiver) {
    return [trapReceiver.ipAddress, trapReceiver.port, trapReceiver.community];
}
exports.getTrapReceiver = getTrapReceiver;

function getFilterDetails(filter) {
    return [filter.field, filter.operator, filter.value, filter.join];

}
exports.getFilterDetails = getFilterDetails;


function listToConsole(data) {
    var details = new columnizer();
    details.row("IP Address", "Port", "Trap Community String");
    for (var i = 0; i < data.trapReceiver.length; i++) {
        var response = getTrapReceiver(data.trapReceiver[i]);
        details.row(response[0], response[1], response[2]);
    }
    details.print();
}

function detailToConsole(data, opts) {
    for (var i = 0; i < data.trapReceiver.length; i++) {
        if (data.trapReceiver[i].ipAddress === opts.detail) {
            console.log(getTrapReceiver(data.trapReceiver[i]));
            console.log("");
            var details = new columnizer();
            details.row("Match On", "Operator", "Value", "Join Type");
            for (var j = 0; j < data.trapReceiver[i].filters.filter.length; j++) {
                var filter = getFilterDetails(data.trapReceiver[i].filters.filter[j]);
                details.row(filter[0], filter[1], filter[2], filter[3]);
            }
            details.print();
        }
    }
}

exports.command = function (opts) {
    opts.command('noc')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) get the list of trap receivers registered with PSM"
        })
        .option('detail', {
            abbr: 'd',
            metavar: 'IPADDR',
            help: "describe the filters for the trap receiver"
        })
        .help("Provides trap receiver info provisioned on PSM for integrating with a NOC, for e.g. Netcool.")
        .callback(function (opts) {
            rest.get(helper.getURL(opts) + 'TrapReceivers', helper.getOptions(opts),
                function (error, data, res) {
                    if (error instanceof Error) {
                        helper.handleError(error.message);
                    } else {
                        if (res.statusCode === 200) {
                            if (data.trapReceiver) {
                                if (opts.detail) {
                                    detailToConsole(data, opts);
                                } else {
                                    listToConsole(data);
                                }
                            }
                        } else {
                            helper.not200(res, "System Info");
                        }
                    }
                });
        });
};


exports.listToConsole = listToConsole;
