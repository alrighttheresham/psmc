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
    for (var i = 0; i < data.client.length; i++) {
        if(data.client[i].connected === true) {
            console.log(data.client[i].userId + "@" + data.client[i].sourceIpAddress);
        }
    }
}


function detailToConsole(data,opts) {
    for (var i = 0; i < data.client.length; i++) {
        if(data.client[i].userId === opts.detail) {
            console.log("User: " + data.client[i].userId + "\tSource: " + data.client[i].sourceIpAddress + "\tLast time connected: " + new Date(data.client[i].lastConnected).toUTCString());
        }
    }
}


exports.command = function (opts) {
    opts.command('usr')
        .option('list', {
            abbr:'l',
            flag:true,
            help:"(default) get a list of connected users"
        }).option('detail', {
            abbr:'d',
            metavar:'USER',
            help:"show last connected time for a user, list all from different sources"
        })
        .help("Provides information on the connected users.")
        .callback(function (opts) {
            if (opts.detail) {
                rest.get(helper.getURL(opts) + 'Clients', helper.getOptions(opts),

                         function (error, data) {
                             if (error instanceof Error) {
                                 helper.handleError(error.message);
                             } else {
                                 detailToConsole(data,opts);
                             }
                         });
            } else {
                rest.get(helper.getURL(opts) + 'Clients', helper.getOptions(opts),

                         function (error, data) {
                             if (error instanceof Error) {
                                 helper.handleError(error.message);
                             } else {
                                 listToConsole(data);
                             }
                         });
            }
        });
};


exports.listToConsole = listToConsole;