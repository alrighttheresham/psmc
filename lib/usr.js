/*
 * Connected Users
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');
var columnizer = require('columnizer');

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

function provToConsole(data) {
    var ethTable = new columnizer();
    ethTable.row("User (" + data.user.length + ")" , "Roles");
    for (var i = 0; i < data.user.length; i++) {
        var roles = [];
        for (var j = 0; j < data.user[i].roles.role.length; j++) {
            roles.push(data.user[i].roles.role[j].roleId);
        }
        ethTable.row(data.user[i].username, roles.toString());
    }
    ethTable.print();
}

var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        if (opts.detail) {
            detailToConsole(data, opts);
        } else if (opts.prov) {
            provToConsole(data);
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
        }).option('prov', {
            abbr: 'r',
            flag: true,
            help: "get a list of connected of all provisioned users and their roles"
        }).option('detail', {
            abbr: 'd',
            metavar: 'USER',
            help: "show last connected time for a user, list all from different sources"
        })
        .help("Provides information on the connected users.")
        .callback(function (opts) {
            if (opts.prov) {
                helper.requestWithEncoding(opts, "Users", callback);
            } else {
                helper.requestWithEncoding(opts, "Clients", callback);
            }
        });
};


exports.listToConsole = listToConsole;
