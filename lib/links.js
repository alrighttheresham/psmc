/*
 * Link Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var helper = require('./helper');

function getPortDetail(data, shelfData) {
    var macAddress = "UNKNOWN";
    for (var i = 0; i < shelfData.shelfList.length; i++) {
        if (data.switchReference.ipAddress === shelfData.shelfList[i].networkElement.address) {
            for (var j = 0; j < shelfData.shelfList[i].ethernetLayer.switch.length; j++) {
                if (shelfData.shelfList[i].ethernetLayer.switch[j].index ===
                    data.switchReference.switchIndex) {
                    for (var k = 0; k < shelfData.shelfList[i].ethernetLayer.switch[j].portList.length; k++) {
                        if (shelfData.shelfList[i].ethernetLayer.switch[j].portList[k].shelfIndex
                            === data.shelfIndex && shelfData.shelfList[i].ethernetLayer.switch[j].portList[k].slotIndex
                            === data.slotIndex && shelfData.shelfList[i].ethernetLayer.switch[j].portList[k].index
                            === data.index && shelfData.shelfList[i].ethernetLayer.switch[j].portList[k].type
                            === data.type) {

                            if (shelfData.shelfList[i].ethernetLayer.switch[j].portList[k].macAddress) {
                                macAddress =
                                    shelfData.shelfList[i].ethernetLayer.switch[j].portList[k].macAddress;
                            } else {
                                macAddress = shelfData.shelfList[i].ethernetLayer.switch[j].macAddress;
                            }
                            break;

                        }

                    }

                }

            }


        }
    }
    return data.switchReference.ipAddress + " "
        + data.switchReference.switchIndex
        + ":"
        + data.shelfIndex +
        ":" + data.slotIndex +
        ":" + data.type +
        ":" + data.index +
        " (" + macAddress + ") ";
}

function listToConsole(data, shelfData) {
    if (data.ethernetLinks) {
        for (var i = 0; i < data.ethernetLinks.length; i++) {
            var toPort = getPortDetail(data.ethernetLinks[i].toPort, shelfData);
            var fromPort = getPortDetail(data.ethernetLinks[i].fromPort, shelfData);
            console.log(toPort + " <-> " + fromPort);
        }
    } else {
        console.log("No Links present");
    }
}


exports.command = function (opts) {
    opts.command('links')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) get the learned link information (limited"
                + " to ethernet)"
        })
        .help("Provides information on the port links.")
        .callback(function (opts) {
            rest.get(helper.getURL(opts) + 'Devices/ShelfInfo', helper.getOptions(opts),
                function (error, shelfData, res) {
                    if (error instanceof Error) {
                        helper.handleError(error.message);
                    } else {
                        if (res.statusCode == "200") {
                            rest.get(helper.getURL(opts) + 'NetworkServices', helper.getOptions(opts),
                                function (error, data) {
                                    if (error instanceof Error) {
                                        helper.handleError(error.message);
                                    } else {
                                        listToConsole(data, shelfData);
                                    }
                                });
                        } else {
                            helper.not200(res, "Port Links");
                        }
                    }
                });


        });
};


exports.listToConsole = listToConsole;
