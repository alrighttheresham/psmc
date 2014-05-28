/*
 * System Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');
var columnizer = require('columnizer');


function listToConsole(data) {
    if (data.shelfList) {
        for (var i = 0; i < data.shelfList.length; i++) {
            if (data.shelfList[i].ethernetLayer != null) {
                for (var j = 0; j < data.shelfList[i].ethernetLayer.switch.length; j++) {
                    var enabledProtocols = data.shelfList[i].ethernetLayer.switch[j].enabledProtocols;
                    if (enabledProtocols) {
                        if (enabledProtocols.indexOf('GVRP') > -1) {
                            var isNNI = false;
                            var gvrpPorts = new columnizer();
                            gvrpPorts.row("L2 Type", "Shelf", "Slot", "Index", "Type", "L2 Oper State");
                            for (var k = 0; k < data.shelfList[i].ethernetLayer.switch[j].portList.length; k++) {
                                if (data.shelfList[i].ethernetLayer.switch[j].portList[k].gvrpState === "ENABLED") {
                                    if (data.shelfList[i].ethernetLayer.switch[j].portList[k].l2Type === "NNI") {
                                        isNNI = true;
                                        gvrpPorts.row("NNI", data.shelfList[i].ethernetLayer.switch[j].portList[k].shelfIndex,
                                            data.shelfList[i].ethernetLayer.switch[j].portList[k].slotIndex,
                                            data.shelfList[i].ethernetLayer.switch[j].portList[k].index,
                                            data.shelfList[i].ethernetLayer.switch[j].portList[k].type,
                                            data.shelfList[i].ethernetLayer.switch[j].portList[k].l2OperState);
                                    }
                                }
                            }
                            if (isNNI) {
                                console.log("");
                                console.log("--- GVRP enabled on Network Element: " + data.shelfList[i].networkElement.address + " Switch " + data.shelfList[i].ethernetLayer.switch[j].index + " ---");
                                console.log("");
                                gvrpPorts.print();
                                console.log(" ");
                            }
                        }
                    }
                }
            }
        }
    }
}
var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        listToConsole(data);
    }
};

exports.command = function (opts) {
    opts.command('gvrp')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) get the NNI Port Info for GVRP"
        })
        .help("Provides information on GVRP in the network.")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "Devices/ShelfInfo", callback);
        });
};


exports.listToConsole = listToConsole;