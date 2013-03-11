/*
 * Customer Information
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var helper = require('./helper');

function listToConsole(data) {
    console.log("Customers (" + data.customer.length + ")");
    for (var i = 0; i < data.customer.length; i++) {
        console.log(data.customer[i].companyName);
    }
}
function cleanupEmployee (employee) {
    var details = [];
    if(employee.name) {
        details.push(employee.name);
    }
    if(employee.email) {
        details.push(employee.email);
    }
    if(employee.telephone) {
        details.push(employee.telephone);
    }
    return details.toString();
}
function detailToConsole(data, opts) {
    for (var i = 0; i < data.customer.length; i++) {
        if (data.customer[i].companyName.indexOf(opts.detail) === 0) {
            console.log(data.customer[i].companyName);
            if (!(data.customer[i].companyRef === "")) {
                console.log(data.customer[i].companyRef);
            }
            if (!(data.customer[i].notes === null)) {
                console.log(data.customer[i].notes);
            }
            for (var j = 0; j < data.customer[i].employees.employee.length; j++) {
                if (data.customer[i].employees.employee[j].primaryContact === true) {
                    console.log("\tPrimary Contact: " + cleanupEmployee(data.customer[i].employees.employee[j]));

                }
                else if (data.customer[i].employees.employee[j].maintenanceContact === true) {
                    console.log("\tMaintenance Contact: " + cleanupEmployee(data.customer[i].employees.employee[j]));
                } else {
                    console.log("\tContact: " + cleanupEmployee(data.customer[i].employees.employee[j]));
                }
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
            metavar: 'NAME',
            help: "detailed information on a customer, filtered on company name"
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

exports.listToConsole = listToConsole;