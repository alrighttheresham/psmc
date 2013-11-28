/*
 * Link Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var graphviz = require('graphviz');
var HashMap = require('hashmap').HashMap;

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


function graphToConsole(data) {
    if (data.ethernetLinks) {
        var map = new HashMap();
        var g = graphviz.digraph("network");
        for (var i = 0; i < data.ethernetLinks.length; i++) {
            if (!map.get(data.ethernetLinks[i].toPort.switchReference.ipAddress)) {
                map.set((data.ethernetLinks[i].toPort.switchReference.ipAddress),
                    g.addNode( data.ethernetLinks[i].toPort.switchReference.ipAddress ));
            }
            if (!map.get(data.ethernetLinks[i].fromPort.switchReference.ipAddress)) {
                map.set((data.ethernetLinks[i].fromPort.switchReference.ipAddress),
                    g.addNode( data.ethernetLinks[i].fromPort.switchReference.ipAddress ));
            }
            var e = g.addEdge( data.ethernetLinks[i].fromPort.switchReference.ipAddress, data.ethernetLinks[i].toPort.switchReference.ipAddress);

            var to = helper.buildShelf(data.ethernetLinks[i].toPort.type,
                data.ethernetLinks[i].toPort.shelfIndex,
                data.ethernetLinks[i].toPort.slotIndex,
                data.ethernetLinks[i].toPort.index);

            var from =  helper.buildShelf(data.ethernetLinks[i].fromPort.type,
                data.ethernetLinks[i].fromPort.shelfIndex,
                data.ethernetLinks[i].fromPort.slotIndex,
                data.ethernetLinks[i].fromPort.index);

            e.set("label", to + " -> " + from);
        }
        console.log( g.to_dot() );
    }
}

var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else if (opts.dot) {
        graphToConsole(data, opts);
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
        .option('dot', {
            abbr: 'd',
            flag: true,
            help: "generated a directional graph for the l2 network (limited to ethernet)"
        })
        .help("Provides information on the port links.")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "NetworkServicesTopology", callback);
        });
};


exports.listToConsole = listToConsole;
