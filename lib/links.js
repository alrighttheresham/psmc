/*
 * Link Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');
var Columnizer = require('columnizer');

var linksTable = new Columnizer();
linksTable.row("Network Element", "Switch", "Port", "Network Element", "Switch", "Port");


function listToConsole(data) {
    if (data.ethernetLinks) {
        for (var i = 0; i < data.ethernetLinks.length; i++) {
            linksTable.row(
                data.ethernetLinks[i].toPort.switchReference.ipAddress,
                data.ethernetLinks[i].toPort.switchReference.switchIndex,
                helper.buildShelf(data.ethernetLinks[i].toPort.type,
                    data.ethernetLinks[i].toPort.shelfIndex,
                    data.ethernetLinks[i].toPort.slotIndex,
                    data.ethernetLinks[i].toPort.index),

                data.ethernetLinks[i].fromPort.switchReference.ipAddress,
                data.ethernetLinks[i].fromPort.switchReference.switchIndex,
                helper.buildShelf(data.ethernetLinks[i].fromPort.type,
                    data.ethernetLinks[i].fromPort.shelfIndex,
                    data.ethernetLinks[i].fromPort.slotIndex,
                    data.ethernetLinks[i].fromPort.index));
        }
        linksTable.print();
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
    opts.command('links')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) get the learned link information (limited to ethernet)"
        })
        .help("Provides information on the port links.")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "NetworkServicesTopology", callback);
        });
};


exports.listToConsole = listToConsole;
