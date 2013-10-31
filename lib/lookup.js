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

function lookup(trapList, oid) {
    for (var i = 0; i < trapList.traps.length; i++) {
        var trapName = trapList.traps[i].name;
        var trapOid = trapList.traps[i].oid;
        if(oid === trapOid) {
            return trapName;
        }
    }
    return oid;
}
 
exports.trap = function(oid) {
    var trapName = lookup(bti7000, oid);

    if(trapName === oid) {
        trapName = lookup(bti800, oid);
    }

    if(trapName === oid) {
        trapName = lookup(bti700, oid);
    }

    if(trapName === oid) {
        trapName = lookup(bti700e, oid);
    }

    return trapName;
};
