

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
                if (!map.get(data.shelfList[i].shelf[j].name)) {
                    map.set(data.shelfList[i].shelf[j].name, new Array(data.shelfList[i].shelf[j].chassisPEC));
                } else {
                    map.get(data.shelfList[i].shelf[j].name).push(data.shelfList[i].shelf[j].chassisPEC);
                }
            }
            for (var k = 0; k < data.shelfList[i].shelf[j].slot.length; k++) {
                if (helper.notNull(data.shelfList[i].shelf[j].slot[k].packPec)) {
                    if (data.shelfList[i].shelf[j].slot[k].packPec.startsWith("B")) {
                        if (data.shelfList[i].shelf[j].slot[k].inserted === true) {
                            if (!map.get(data.shelfList[i].shelf[j].slot[k].name)) {
                                map.set(data.shelfList[i].shelf[j].slot[k].name, new Array(data.shelfList[i].shelf[j].slot[k].packPec));
                            } else {
                                map.get(data.shelfList[i].shelf[j].slot[k].name).push(data.shelfList[i].shelf[j].slot[k].packPec);
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
        ethTable.row(value[0], key, value.length);
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

