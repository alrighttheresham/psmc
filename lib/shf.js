/*
 * Shelf Information
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var helper = require('./helper');
function checkWavelength(channelType) {
    if (channelType === null) {
        return "N/A";
    } else {
        return channelType.wavelength;
    }
}
function detailToConsole(data) {
    if (data.shelf) {
        console.log(data.networkElement.address + "\t" + data.networkElement.type + "\t" + data.networkElement.version);
        for (var i = 0; i < data.shelf.length; i++) {
            for (var j = 0; j < data.shelf[i].slot.length; j++) {
                console.log(data.shelf[i].index +
                    "/" + data.shelf[i].slot[j].index +
                    "\tName: " + helper.notNull(data.shelf[i].slot[j].name));
                for (var k = 0; k < data.shelf[i].slot[j].pluggable.length; k++) {
                    console.log("\t" + data.shelf[i].index +
                        "/" + data.shelf[i].slot[j].index +
                        "/" + data.shelf[i].slot[j].pluggable[k].index +
                        "\tType: " + data.shelf[i].slot[j].pluggable[k].type +
                        "\tChannel Type: " + checkWavelength(data.shelf[i].slot[j].pluggable[k].channelType));
                }
            }

        }
    }
}
exports.command = function (opts) {
    opts.command('shf')
        .option('detail', {
            abbr: 'd',
            metavar: 'IPADDR',
            help: "detailed information on a shelf, filtered on network element ip address"
        })
        .help("Provides shelf information from a discovered network element on the PSM Server.")
        .callback(function (opts) {
            if (opts.detail) {
                rest.get(helper.getURL(opts) + 'Devices/ShelfInfo/' + opts.detail, helper.getOptions(opts),
                    function (error, data, res) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            if (res.statusCode === 200) {
                                detailToConsole(data);
                            } else {
                                helper.not200(res, "Shelf Info");
                            }
                        }
                    });
            }
        });
};
