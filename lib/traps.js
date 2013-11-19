/*
 * Trap Counts
 * https://github.com/lumberbaron/psm-traps
 *
 * Copyright (c) 2013 James Ellwood
 * Licensed under the MIT license.
 */
 
 'use strict';

 var Columnizer = require('columnizer');
 var dateFormat = require('dateformat');
 
 var database = require("./database");
 var lookup = require("./lookup");
 
 function getDate(minutes) {
    var now = new Date();
    now.setMinutes(now.getMinutes() - minutes);
    return dateFormat(now, "yyyy-mm-dd HH:MM");
}
 
 function printTrapCountsForElement(rows) {
	var columns = new Columnizer();
	columns.row("Trap", "Count", "First Trap Time", "Last Trap Time");
	
	for(var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var trapOid = row.trapOid;
		var trapName = lookup.trap(trapOid);
		var minTrapDate = dateFormat(new Date(row.minTrapTime), "yyyy-mm-dd HH:MM");
		var maxTrapDate = dateFormat(new Date(row.maxTrapTime), "yyyy-mm-dd HH:MM");
		columns.row(trapName, row.count, minTrapDate, maxTrapDate);
	}
	
	columns.print();
	
	database.disconnect();
}

 function printTrapCountsForElements(rows) {
    var columns = new Columnizer();
    columns.row("Network Element", "Count", "First Trap Time", "Last Trap Time");

    for(var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var minTrapDate = dateFormat(new Date(row.minTrapTime), "yyyy-mm-dd HH:MM");
        var maxTrapDate = dateFormat(new Date(row.maxTrapTime), "yyyy-mm-dd HH:MM");
        columns.row(row.deviceAddress, row.count, minTrapDate, maxTrapDate);
    }
    
    columns.print();
    
    database.disconnect();
}
 
 function printTrapCounts(opts) {	
    database.connect(opts);
    
    var lastMinutes = 0;
    if(opts.last != null) {
        lastMinutes = opts.last;
    }
    
    var lastMinutesDate = '';
    if(lastMinutes > 0) {
        lastMinutesDate = getDate(lastMinutes);
    }
        
    if(opts.element) {
        database.trapCountsForElement(opts.element, lastMinutesDate, printTrapCountsForElement);
    } else if(opts.trap) {
        var trapOids = lookup.oid(opts.trap);
        database.trapCountsForOid(trapOids, lastMinutesDate, printTrapCountsForElements);
    } else {
        database.totalTrapCounts(lastMinutesDate, printTrapCountsForElements);
    }
}
 
 exports.command = function(opts) {
	opts.command('traps')
    .option('element', {
        abbr: 'e',
		metvar: 'ELEMENT',
        help: "counts for network element"
    })
	.option('trap', {
        abbr: 't',
		metvar: 'TRAP',
        help: "counts for trap"
    })
    .option('last', {
        abbr: 'l',
		metvar: 'MINUTES',
        help: "counts in last [MINUTES] minutes"
    })
	.callback(printTrapCounts);
};
