/*
 * MSTP Information
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var helper = require('./helper');

var Columnizer = require('columnizer');


function listToConsole(data) {
    var mstp = new Columnizer;
    mstp.row("IP Address", "NE Type", "MAC Address", "ID Digest");
    for (var i = 0; i < data.region.length; i++) {
        for (var j = 0; j < data.region[i].bridge.length; j++) {
            mstp.row(data.region[i].bridge[j].ipAddress,
                     data.region[i].bridge[j].type,
                     data.region[i].bridge[j].macAddress,
                     data.region[i].bridge[j].idDigest);
        }
    }
    mstp.print();

}

function instancesToConsole(data) {
    var mstp = new Columnizer;
    mstp.row("IP Address", "Instance", "Root Bridge");
    for (var i = 0; i < data.region.length; i++) {
        for (var j = 0; j < data.region[i].bridge.length; j++) {
            for (var k = 0; k < data.region[i].bridge[j].instance.length; k++) {
                mstp.row(data.region[i].bridge[j].ipAddress,
                         data.region[i].bridge[j].instance[k].id,
                         data.region[i].bridge[j].instance[k].rootBridge);
            }
        }
    }
    mstp.print();
}

function portsToConsole(data) {
    var mstp = new Columnizer;
    mstp.row("IP Address", "Instance", "Port", "Role","State","Cost",
             "Priority", "DBridge", "DPort", "DRoot");
    for (var i = 0; i < data.region.length; i++) {
        for (var j = 0; j < data.region[i].bridge.length; j++) {
            for (var k = 0; k < data.region[i].bridge[j].instance.length; k++) {
                for (var l = 0; l < data.region[i].bridge[j].instance[k].interface.length; l++) {
                    mstp.row(data.region[i].bridge[j].ipAddress,
                             data.region[i].bridge[j].instance[k].id,
                             data.region[i].bridge[j].instance[k].interface[l].name,
                             data.region[i].bridge[j].instance[k].interface[l].role,
                             data.region[i].bridge[j].instance[k].interface[l].state,
                             data.region[i].bridge[j].instance[k].interface[l].cost, 
                             data.region[i].bridge[j].instance[k].interface[l].priority,
                             data.region[i].bridge[j].instance[k].interface[l].designatedBridge,
                             data.region[i].bridge[j].instance[k].interface[l].designatedPort,
                             data.region[i].bridge[j].instance[k].interface[l].designatedRoot);
                }
            }
        }
    }
    mstp.print();
}


exports.command = function (opts) {
    opts.command('mstp')
        .option('list', {
            abbr:'l',
            flag:true,
            help:"(default) high level mstp information"
        }).option('instances', {
            abbr:'i',
            flag:true,
            help:"instance specific information"
        }).option('ports', {
            abbr:'x',
            flag:true,
            help:"port specific information"
        })
        .help("Provides information on the MSTP configuration.")
        .callback(function (opts) {
            rest.get(helper.getURL(opts) + 'Mstp', helper.getOptions(opts),
                     function (error, data) {
                         if (error instanceof Error) {
                             helper.handleError(error.message);
                         } else {
                             if (opts.instances) {
                                 instancesToConsole(data);
                             } else if (opts.ports) {
                                 portsToConsole(data);
                             } else { 
                                 listToConsole(data);
                             }
                         }
                     });
        });
};


exports.listToConsole = listToConsole;
