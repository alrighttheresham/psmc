/*
 * psm-traps
 * https://github.com/lumberbaron/psm-traps
 *
 * Copyright (c) 2013 James Ellwood
 * Licensed under the MIT license.
 */
 
 'use strict';
 
var mysql = require('mysql');
var connection;

exports.connect = function(opts) {
    var address = opts.server.split(':')[0];
	connection = mysql.createConnection({
		host     : address,
		user     : 'root',
		password : opts.dbpassword,
		database : 'ems'
	});

	connection.connect();
};

exports.disconnect = function() {
	connection.end();
};

exports.totalTrapCounts = function(afterDate, callback) {
    var afterDateQuery = '';
    if(afterDate !== '') {
        afterDateQuery = "WHERE trapTime > '" + afterDate + "'"; 
    }
    
    var query = 'SELECT deviceAddress, count(*) as count, MIN(trapTime) as minTrapTime, MAX(trapTime) as maxTrapTime FROM Notifications ' + afterDateQuery + ' GROUP BY ' + ' deviceAddress ORDER BY count DESC';

	connection.query(query, function(err, rows) {
		if (err) {
            throw err;
        }
		callback(rows);
	});
};

exports.trapCountsForOid = function(trapOids, afterDate, callback) {
	var afterDateQuery = '';
	if(afterDate !== '') {
        afterDateQuery = "AND trapTime > '" + afterDate + "'"; 
    }
	
    var trapOidQuery = "(trapOid = '" + trapOids[0] + "'";
    if(trapOidQuery.length > 1) {
        for(var x = 1; x < trapOids.length; x++) {
            trapOidQuery += " OR trapOid = '" + trapOids[x] + "'";
        }
    }
    trapOidQuery += ")";
    
	var query = "SELECT deviceAddress, count(*) as count, MIN(trapTime) as minTrapTime, MAX(trapTime) as maxTrapTime FROM Notifications WHERE " + trapOidQuery + afterDateQuery + " GROUP BY deviceAddress ORDER BY count DESC;";
    
	connection.query(query, function(err, rows) {
		if (err) {
            throw err;
        }
		callback(rows);
	});
};

exports.trapCountsForElement = function(element, afterDate, callback) {
    var afterDateQuery = '';
    if(afterDate !== '') {
        afterDateQuery = "AND trapTime > '" + afterDate + "'"; 
    }
    
    var query = "SELECT trapOid, count(*) as count, MIN(trapTime) as minTrapTime, MAX(trapTime) as maxTrapTime FROM Notifications WHERE deviceAddress = '" + element + "' " + afterDateQuery + " GROUP BY trapOid ORDER BY count DESC;";

    connection.query(query, function(err, rows) {
		if (err) {
            throw err;
        }
		callback(rows);
	});
};
