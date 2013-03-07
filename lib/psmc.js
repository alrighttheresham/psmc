#!/usr/bin/env node
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

opts.option('version', {
      flag: true,
      abbr: 'v',
      help: 'print version and exit',
      callback: function() {
         return "psmc version " + version;
      }
});

opts.option('server', {
      abbr: 's',
      help: 'specify the ip address and port of the psm server',
      default: 'localhost:9998'
});


opts.option('username', {
      abbr: 'u',
      help: 'specify the username',
      default: 'admin'
});

opts.option('password', {
      abbr: 'p',
      help: 'specify the password',
      default: 'admin'
});


opts.command('ne')
   .option('list', {
      abbr: 'l',
      flag: true,
      help: "get the discovered list of Network Elements"
   })
   .option('detail', {
      abbr: 'd',
      metavar: 'IPADDR',
      help: "get detailed information on a Network Element"
   })
   .help("Provides a set of operations that will return information on the discovered Network Elements")

opts.command('na')
   .option('list', {
      abbr: 'l',
      flag: true,
      help: "get the discovered list of Network Alarms"
   })
   .option('detail', {
      abbr: 'd',
      metavar: 'ID',
      help: "get detailed information on a Network Alarm"
   })
   .help("Provides a set of operations that will return information on the discovered Network Alarms")

opts.script("psmc");
opts.parse();


if (!process.args.length) {
  opts.usage();
  process.exit(1);
}

/**
program
  .version(version)
  .usage('[options] [command]')
  .option('-s, --server <ipaddress:port>', 'specify the ip address and port of the psm server [localhost:9998]', 'localhost:9998')
  .option('-u, --username <username>', 'specify the username [admin]', 'admin')
  .option('-p, --password <password>', 'specify the password [admin]', 'admin');

program
  .command('ne <list>')
   .description('-- Network Element list --')
   .action(function(){
       console.log('ne list called.')
   });


program
  .command('ne details <ipaddress>')
   .description('-- Network Element details --')
   .action(function(){
       console.log('ne ipaddress called.')
   });

  program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    psmc -s 172.27.5.230:9998 ne list');
  console.log('');
	})
  .parse(process.argv);


if (!program.args.length) {
  program.help()
}

**/

