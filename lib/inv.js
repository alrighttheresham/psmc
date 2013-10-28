/*
 * Inventory
 * https://github.com/btisystems/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');
var HashMap = require('hashmap').HashMap;
var columnizer = require('columnizer');

function listToConsole(data) {

    var map = new HashMap();

    for (var i = 0; i < data.shelfList.length; i++) {
        for (var j = 0; j < data.shelfList[i].shelf.length; j++) {
            if (helper.notNull(data.shelfList[i].shelf[j].chassisPEC)) {
                if (data.shelfList[i].networkElement.type === "BTI-7800") {
                    if (!map.get(data.shelfList[i].shelf[j].chassisPEC)) {
                        map.set(data.shelfList[i].shelf[j].chassisPEC, new Array(data.shelfList[i].shelf[j].shortName));
                    } else {
                        map.get(data.shelfList[i].shelf[j].chassisPEC).push(data.shelfList[i].shelf[j].shortName);
                    }
                } else {
                    if (!map.get(data.shelfList[i].shelf[j].chassisPEC)) {
                        map.set(data.shelfList[i].shelf[j].chassisPEC, new Array(data.shelfList[i].shelf[j].name));
                    } else {
                        map.get(data.shelfList[i].shelf[j].chassisPEC).push(data.shelfList[i].shelf[j].name);
                    }
                }
            }
            for (var k = 0; k < data.shelfList[i].shelf[j].slot.length; k++) {
                if (helper.notNull(data.shelfList[i].shelf[j].slot[k].packPec)) {
                    if (data.shelfList[i].shelf[j].slot[k].packPec.startsWith("B")) {
                        if (data.shelfList[i].shelf[j].slot[k].inserted === true) {
                            if (data.shelfList[i].networkElement.type === "BTI-7800") {
                                if (!map.get(data.shelfList[i].shelf[j].slot[k].packPec)) {
                                    map.set(data.shelfList[i].shelf[j].slot[k].packPec, new Array(data.shelfList[i].shelf[j].slot[k].packFullName));
                                } else {
                                    map.get(data.shelfList[i].shelf[j].slot[k].packPec).push(data.shelfList[i].shelf[j].slot[k].packFullName);
                                }
                            } else {
                                if (!map.get(data.shelfList[i].shelf[j].slot[k].packPec)) {
                                    map.set(data.shelfList[i].shelf[j].slot[k].packPec, new Array(data.shelfList[i].shelf[j].slot[k].name));
                                } else {
                                    map.get(data.shelfList[i].shelf[j].slot[k].packPec).push(data.shelfList[i].shelf[j].slot[k].name);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    var ethTable = new columnizer();
    ethTable.row("Pec", "Name", "Count");
    map.forEach(function (value, key) {
        ethTable.row(key, value[0], value.length);
    });
    ethTable.print();
}

var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        listToConsole(data);
    }
};

exports.command = function (opts) {
    opts.command('inv')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) get a inventory card level count"
        })
        .help("Provides inventory information for the network.")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "Devices/ShelfInfo", callback);
        });
};


exports.listToConsole = listToConsole;

