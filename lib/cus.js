/*
 * System Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var helper = require('./helper');

function listToConsole(data) {
    for (var i = 0; i < data.customer.length; i++) {
        console.log(data.customer[i].companyName);
        console.log(data.customer[i].companyRef);
        if (!data.customer[i].notes === "null") {
            console.log("\t" + data.customer[i].notes);
        }
        for (var j = 0; j < data.customer[i].employees.employee.length; j++) {
            console.log("\t" + data.customer[i].employees.employee[j].name);
            console.log("\t" + data.customer[i].employees.employee[j].email);
            console.log("\t" + data.customer[i].employees.employee[j].telephone);
            if (data.customer[i].employees.employee[j].primaryContact == true) {
                console.log("\tPrimary Contact");
            }
            if (data.customer[i].employees.employee[j].maintenanceContact == true) {
                console.log("\t\Maintenance Contact");
            }
            console.log(" ");
        }
    }
}
function detailToConsole(data, opts) {
    for (var i = 0; i < data.customer.length; i++) {
        if (data.customer[i].companyRef == opts.detail) {
            console.log(data.customer[i].companyName);
            console.log(data.customer[i].companyRef);
            if (!data.customer[i].notes === "null") {
                console.log("\t" + data.customer[i].notes);
            }
            for (var j = 0; j < data.customer[i].employees.employee.length; j++) {
                console.log("\t" + data.customer[i].employees.employee[j].name);
                console.log("\t" + data.customer[i].employees.employee[j].email);
                console.log("\t" + data.customer[i].employees.employee[j].telephone);
                if (data.customer[i].employees.employee[j].primaryContact == true) {
                    console.log("\tPrimary Contact");
                }
                if (data.customer[i].employees.employee[j].maintenanceContact == true) {
                    console.log("\t\Maintenance Contact");
                }
                console.log(" ");
            }
        }
    }
}
exports.command = function (opts) {
    opts.command('cus')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "get the list of provisioned customers from the system"
        })
        .option('detail', {
            abbr: 'd',
            metavar: 'REF',
            help: "detailed information on a customer, filtered on company reference"
        })
        .help("Provides customer information from the PSM Server.")
        .callback(function (opts) {
            if (opts.list) {
                rest.get(helper.getURL(opts) + 'Customers', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            listToConsole(data);
                        }
                    });
            } else if (opts.detail) {
                rest.get(helper.getURL(opts) + 'Customers', helper.getOptions(opts),

                    function (error, data) {
                        if (error instanceof Error) {
                            helper.handleError(error.message);
                        } else {
                            detailToConsole(data, opts);
                        }
                    });

            }
        });
};