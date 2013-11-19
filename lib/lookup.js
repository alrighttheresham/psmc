/*
 * Trap Lookup
 * https://github.com/lumberbaron/psm-traps
 *
 * Copyright (c) 2013 James Ellwood
 * Licensed under the MIT license.
 */

'use strict';

var bti7000 = require("./traps/bti7000.json");
var bti800 = require("./traps/bti800.json");
var bti700 = require("./traps/bti700.json");
var bti700e = require("./traps/bti700e.json");
var bti7800 = require("./traps/bti7800.json");

function lookupOid(trapList, trapOid) {
    for (var i = 0; i < trapList.traps.length; i++) {
        var name = trapList.traps[i].name;
        var oid = trapList.traps[i].oid;
        if(oid === trapOid) {
            return name;
        }
    }
    return trapOid;
}

function lookupTrap(trapList, trapName, trapOids) {
    for (var i = 0; i < trapList.traps.length; i++) {
        var name = trapList.traps[i].name;
        var oid = trapList.traps[i].oid;
        if(name.toUpperCase() === trapName.toUpperCase()) {
            trapOids.push(oid);
        }
    }
    
    return trapOids;
}
 
exports.trap = function(trapOid) {
    var trapName = lookupOid(bti7000, trapOid);

    if(trapName === trapOid) {
        trapName = lookupOid(bti800, trapOid);
    }

    if(trapName === trapOid) {
        trapName = lookupOid(bti700, trapOid);
    }

    if(trapName === trapOid) {
        trapName = lookupOid(bti700e, trapOid);
    }

    if(trapName === trapOid) {
        trapName = lookupOid(bti7800, trapOid);
    }

    return trapName;
};

exports.oid = function(trapName) {
    var trapOids = [];
    lookupTrap(bti7000, trapName, trapOids);
    lookupTrap(bti800, trapName, trapOids);
    lookupTrap(bti700, trapName, trapOids);
    lookupTrap(bti700e, trapName, trapOids);
    lookupTrap(bti7800, trapName, trapOids);
    return trapOids;
};