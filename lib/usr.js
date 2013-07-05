/*
 * Connected Users
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');

function listToConsole(data) {
    var count = 0;
    var connected = [];
    for (var i = 0; i < data.client.length; i++) {
        if (data.client[i].connected === true) {
            count = count + 1;
            var clientVersion = "N/A";
            if (data.client[i].clientVersion) {
                clientVersion = data.client[i].clientVersion;
            }
            connected.push(data.client[i].userId + "@" + data.client[i].sourceIpAddress + " v" + clientVersion);
        }
    }
    console.log("Callback Clients (" + count + ")");
    for (var j = 0; j < connected.length; j++) {
        console.log(connected[j].toString());
    }
}


function detailToConsole(data, opts) {
    for (var i = 0; i < data.client.length; i++) {
        if (data.client[i].userId === opts.detail) {
            console.log("User: " + data.client[i].userId + "\tSource: " + data.client[i].sourceIpAddress + "\tLast time connected: " + new Date(data.client[i].lastConnected).toUTCString());
        }
    }
}

var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        if (opts.detail) {
            detailToConsole(data, opts);
        } else {
            listToConsole(data);
        }
    }
};

exports.command = function (opts) {
    opts.command('usr')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) get a list of connected (valid callback channel) users"
        }).option('detail', {
            abbr: 'd',
            metavar: 'USER',
            help: "show last connected time for a user, list all from different sources"
        })
        .help("Provides information on the connected users.")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "Clients", callback);
        });
};


exports.listToConsole = listToConsole;
