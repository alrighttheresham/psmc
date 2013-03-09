# psmc

command line client for BTI proNX Services Manager (psm).

## Getting Started
Download and install node from here:

<a href="http://nodejs.org/download/" target="_blank">node.js</a>

Install the module with npm:

      npm install -g psmc


## Documentation
      Usage: psmc <command> [options]

      command     one of: sys, ne, na, eth

      Options:
         -v, --version    print version and exit
         -s, --server     specify the ip address and port of the psm server  [localhost:9998]
         -u, --username   specify the username  [admin]
         -p, --password   specify the password  [admin]

## Examples
      psmc eth -h					            Provides help for the options on the <eth> command
      psmc ne -s 172.27.5.230:9998 -l			Provide a list of discovered Network Elements
      psmc eth -s 172.27.5.230:9998 -d 3000		Provides detail on the Ethernet Service identified by the 3000 VLAN ID


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Damian ONeill  
Licensed under the MIT license.
