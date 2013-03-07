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


    opts.command('ne')
        .option('list', {
            abbr:'l',
            flag:true,
            help:"get the discovered list of Network Elements"
        })
        .option('detail', {
            abbr:'d',
            metavar:'IPADDR',
            help:"get detailed information on a Network Element"
        })
        .help("Provides a set of operations that will return information on the discovered Network Elements");

    opts.command('na')
        .option('list', {
            abbr:'l',
            flag:true,
            help:"get the discovered list of Network Alarms"
        })
        .option('detail', {
            abbr:'d',
            metavar:'ID',
            help:"get detailed information on a Network Alarm"
        })
        .help("Provides a set of operations that will return information on the discovered Network Alarms");
    opts.command('eth')
        .option('list', {
            abbr:'l',
            flag:true,
            help:"get the discovered list of Ethernet Services"
        })
        .option('detail', {
            abbr:'d',
            metavar:'VLAN',
            help:"get detailed information on a Ethernet Service"
        })
        .help("Provides a set of operations that will return information on the discovered Ethernet Services");


    /**opts.command('opt')
     .option('list', {
      abbr: 'l',
      flag: true,
      help: "get the discovered list of Optical Services"
   })
     .option('detail', {
      abbr: 'd',
      metavar: 'WAVELENGTH',
      help: "get detailed information on a Optical Service"
   })
     .help("Provides a set of operations that will return information on the discovered Optical Services");
     */


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

