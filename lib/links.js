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

var neMap = new HashMap();

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


function abbType(type) {
    switch (type) {
        case "LAG":
            return "L";
        case "GIGE":
            return "G";
        case "XGIGE":
            return "X";
        default:
            console.log("generated a N/A for " + type);
            return "N/A";
    }
}


function graphToConsole(data, opts) {
    if (data.ethernetLinks) {
        var map = new HashMap();
        var g = graphviz.graph("network");
        g.set("label", "PSM Server: " + opts.server);
        for (var i = 0; i < data.ethernetLinks.length; i++) {
            var toIpAddress = data.ethernetLinks[i].toPort.switchReference.ipAddress;
            if (!map.get(toIpAddress)) {
                map.set((toIpAddress),
                    g.addNode(toIpAddress + "\n" + neMap.get(toIpAddress)));
            }
            var fromIpAddress = data.ethernetLinks[i].fromPort.switchReference.ipAddress;
            if (!map.get(fromIpAddress)) {
                map.set((fromIpAddress),
                    g.addNode(fromIpAddress + "\n" + neMap.get(fromIpAddress)));
            }
            var e = g.addEdge(map.get(fromIpAddress), map.get(toIpAddress));
            e.set("dir", "none");
            if (data.ethernetLinks[i].toPort.type === "LAG") {
                e.set("color", "blue");
            }

            if (data.ethernetLinks[i].toPort.type === "XGIGE") {
                e.set("penwidth", "2");
            }


            var to = helper.buildShelf(abbType(data.ethernetLinks[i].toPort.type),
                data.ethernetLinks[i].toPort.shelfIndex,
                data.ethernetLinks[i].toPort.slotIndex,
                data.ethernetLinks[i].toPort.index);

            var from = helper.buildShelf(abbType(data.ethernetLinks[i].fromPort.type),
                data.ethernetLinks[i].fromPort.shelfIndex,
                data.ethernetLinks[i].fromPort.slotIndex,
                data.ethernetLinks[i].fromPort.index);

            e.set("label", to + " - " + from);
        }
        console.log(g.to_dot());
    }
}

function csvToConsole(data) {
    if (data.ethernetLinks) {
        var a = [];
        for (var i = 0; i < data.ethernetLinks.length; i++) {
            var b = [data.ethernetLinks[i].toPort.switchReference.ipAddress + ":" +
                data.ethernetLinks[i].toPort.switchReference.switchIndex + ":" +
                helper.buildShelf(data.ethernetLinks[i].toPort.type,
                    data.ethernetLinks[i].toPort.shelfIndex,
                    data.ethernetLinks[i].toPort.slotIndex,
                    data.ethernetLinks[i].toPort.index),
                data.ethernetLinks[i].fromPort.switchReference.ipAddress + ":" +
                    data.ethernetLinks[i].fromPort.switchReference.switchIndex + ":" +
                    helper.buildShelf(data.ethernetLinks[i].fromPort.type,
                        data.ethernetLinks[i].fromPort.shelfIndex,
                        data.ethernetLinks[i].fromPort.slotIndex,
                        data.ethernetLinks[i].fromPort.index)];
            a[i] = b;

        }
        a.sort();
        for (var j = 0; j < a.length; j++) {
            console.log(a[j].toString());
        }
    }
}

var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else if (opts.dot) {
        graphToConsole(data, opts);
    } else if (opts.csv) {
        csvToConsole(data, opts);
    } else {
        listToConsole(data);

    }
};

function buildNEList(data) {
    if (data.networkElement) {
        for (var i = 0; i < data.networkElement.length; i++) {
            neMap.set(data.networkElement[i].address, data.networkElement[i].type);
        }
    }
}

var neCallback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        buildNEList(data);
        helper.requestWithEncoding(opts, "NetworkServicesTopology", callback);
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
        .option('csv', {
            abbr: 'c',
            flag: true,
            help: "generated a csv for the l2 network (limited to ethernet)"
        })
        .help("Provides information on the port links.")
        .callback(function (opts) {
            if (opts.dot) {
                helper.requestWithEncoding(opts, "NetworkElements", neCallback);
            } else {
                helper.requestWithEncoding(opts, "NetworkServicesTopology", callback);
            }
        });
};


exports.listToConsole = listToConsole;
