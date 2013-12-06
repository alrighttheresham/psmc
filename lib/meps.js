/*
 * System Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');

function listToConsole(data) {
    if (data.networkService) {
        var meps = [];
        for (var i = 0; i < data.networkService.length; i++) {
            for (var j = 0; j < data.networkService[i].serviceNetworkElements.length; j++) {
                for (var k = 0; k < data.networkService[i].serviceNetworkElements[j].switchList.length; k++) {
                    for (var l = 0; l < data.networkService[i].serviceNetworkElements[j].switchList[k].servicePortList.length; l++) {
                        var servicePort = data.networkService[i].serviceNetworkElements[j].switchList[k].servicePortList[l];
                        if(servicePort.mep) {
                            meps.push(servicePort.mep.id);
                        }
                    }
                }
            }
        }
        console.log("Meps: (" + meps.length + ") : " + meps.toString());
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
    opts.command('meps')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) meps info in a network"
        })
        .help("Provides information on the meps in a network.")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "NetworkServices", callback);
        });
};


exports.listToConsole = listToConsole;