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
var cus = require("./cus");
var init = require("./init");
var usr = require("./usr");
var shf = require("./shf");
                  
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
        default:(process.env.server || 'localhost:9998')
    });


    opts.option('username', {
        abbr:'u',
        help:'specify the username',
        default:(process.env.username || 'admin')
    });

    opts.option('password', {
        abbr:'p',
        help:'specify the password',
        default:(process.env.password || 'admin')
    });

    init.command(opts);
    sys.command(opts);
    ne.command(opts);
    shf.command(opts);
    na.command(opts);
    eth.command(opts);
    //opt.command(opts);
    cus.command(opts);
    usr.command(opts);

    opts.script("psmc");
    opts.help("Examples:" +
        "\n \tpsmc init -s 172.27.5.230:9998 -l\t\tProvides a dump of the base configuration in PSM" + 
        "\n \tpsmc na -h\t\t\t\t\tProvides help for the options on the <na> command" +
        "\n \tpsmc ne -s 172.27.5.230:9998 -l\t\t\tProvide a list of discovered Network Elements" +
        "\n \tpsmc eth -s 172.27.5.230:9998 -d 3000\t\tProvides detail on the Ethernet Service identified by the 3000 VLAN ID" +
        "\n \tpsmc eth -s 172.27.5.230:9998 -a\t\tProvides a list of services that are alarmed" +
        "\n\n\nProvides a command line interface for querying information from a PSM Server.");
    opts.parse();


    if (!process.argv.length) {
        opts.usage();
        process.exit(1);
    }

};

