# psmc

command line client for BTI proNX Services Manager (psm).

## Getting Started
Download and install node from here:

<a href="http://nodejs.org/download/" target="_blank">download node.js</a>

Once node is installed, npm will be available, this can be used to install/upgrade psmc:

      $ npm install -g psmc

The -g option will install/upgrade it globally on your system, this will make it available from any directory.

For some *nix systems you may need to use sudo:

      $ sudo npm install -g psmc

sudo is required if your running as a user other than superuser (root).

NOTE when installing there will be a number of warning displayed on the console, this is output from the third parties that are used in this client application, these can be ignored as they do not affect behaviour. 

## Documentation
Calling psmc without any commands will provide a help message describing the functionality provided by the client.


      Usage: psmc <command> [options]

      command     one of: init, sys, ne, shf, na, eth, cus, usr

      Options:
         -v, --version    print version and exit
         -s, --server     specify the ip address and port of the psm server  [localhost:9998]
         -u, --username   specify the username  [admin]
         -p, --password   specify the password  [admin]

The options above for server, username and password can be persisted as enviroment variables and used directly in the command tool. For example

      $ export server=172.27.5.230:9998
      $ psmc init

This will users if they choose, to store in their environment the ip address, username and password of their local psm server so that they dont have to reenter them every tim the client tool is called. 

The commands provide information on initial configuration, system information, network element specifics, shelf information for a network element, network alarms, ethernet services, customer information and user (connected clients) information. 

## Examples
      $ psmc init -s 172.27.5.230:9998 -l		Provides a dump of the base configuration in PSM
      $ psmc eth -h					                Provides help for the options on the <eth> command
      $ psmc ne -s 172.27.5.230:9998 -l			    Provide a list of discovered Network Elements
      $ psmc eth -s 172.27.5.230:9998 -d 3000		Provides detail on the Ethernet Service identified by the 3000 VLAN ID
      $ psmc eth -s 172.27.5.230:9998 -a		Provides a list of services that are alarmed

Before running the examples you should ensure that the user you authenticate with has administration privleges. 

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Damian ONeill  
Licensed under the MIT license.
