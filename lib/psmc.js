/*
 * psmc
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var opts = require("nomnom");
var version = require('../package.json').version;
var sys = require("./sys");
var ne = require("./ne");
var na = require("./na");
var eth = require("./eth");

exports.run = function () {

    opts.option('version', {
        flag:true,
        abbr:'v',
        help:'print version and exit',
        callback:function () {
            return "psmc version " + version;
        }
    });

    opts.option('server', {
        abbr:'s',
        help:'specify the ip address and port of the psm server',
        default:'localhost:9998'
    });


    opts.option('username', {
        abbr:'u',
        help:'specify the username',
        default:'admin'
    });

    opts.option('password', {
        abbr:'p',
        help:'specify the password',
        default:'admin'
    });

    sys.command(opts);
    ne.command(opts);
    na.command(opts);
    eth.command(opts);
    //opt.command(opts);

    opts.script("psmc");
    opts.help("Examples:" +
        "\n \tpsmc eth -h\t\t\t\t\tProvides help for the options on the <eth> command" +
        "\n \tpsmc ne -s 172.27.5.230:9998 -l\t\t\tProvide a list of discovered Network Elements" +
        "\n \tpsmc eth -s 172.27.5.230:9998 -d 3000\t\tProvides detail on the Ethernet Service identified by the 3000 VLAN ID" +
        "\n\n\nProvides a command line interface for querying information from a PSM Server.");
    opts.parse();


    if (!process.argv.length) {
        opts.usage();
        process.exit(1);
    }

};

