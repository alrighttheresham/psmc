/*
 * Connected Users
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var helper = require('./helper');

function listToConsole(data) {
    var count = 0;
    var connected = [];
    for (var i = 0; i < data.client.length; i++) {
        if (data.client[i].connected === true) {
            count = count + 1;
            connected.push(data.client[i].userId + "@" + data.client[i].sourceIpAddress);
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
            rest.get(helper.getURL(opts) + 'Clients', helper.getOptions(opts),
                function (error, data, res) {
                    if (error instanceof Error) {
                        helper.handleError(error.message);
                    } else {
                        if (res.statusCode == "200") {
                            if (opts.detail) {
                                detailToConsole(data, opts);
                            } else {
                                listToConsole(data);
                            }
                        } else {
                            helper.not200(res, "Client Details");
                        }
                    }
                });
        });
};


exports.listToConsole = listToConsole;
