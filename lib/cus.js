/*
 * Customer Information
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var rest = require('restless');
var columnizer = require('columnizer');
var helper = require('./helper');

function listToConsole(data) {
    if (data.customer) {
        console.log("Customers (" + data.customer.length + ")");
        for (var i = 0; i < data.customer.length; i++) {
            console.log(data.customer[i].companyName);
        }
    }
}
function cleanupEmployee(employee, details, role) {
    details.row(helper.notNull(employee.name), helper.notNull(employee.email), helper.notNull(employee.telephone), role);
}

function detailToConsole(data, opts) {
    for (var i = 0; i < data.customer.length; i++) {
        var details = new columnizer();
        details.row("Name", "Email", "Telephone", "Role");

        if (data.customer[i].companyName.indexOf(opts.detail) === 0) {
            var ref = "";
            if ((data.customer[i].companyRef !== "")) {
                ref = " (" + data.customer[i].companyRef + ")";
            }
            console.log(" ");
            console.log(data.customer[i].companyName + ref);
            if ((data.customer[i].notes !== null)) {
                console.log(data.customer[i].notes);
            }
            for (var j = 0; j < data.customer[i].employees.employee.length; j++) {
                if (data.customer[i].employees.employee[j].primaryContact === true) {
                    cleanupEmployee(data.customer[i].employees.employee[j], details, "Primary");
                }
                else if (data.customer[i].employees.employee[j].maintenanceContact === true) {
                    cleanupEmployee(data.customer[i].employees.employee[j], details, "Maintenance");
                } else {
                    cleanupEmployee(data.customer[i].employees.employee[j], details, "Not Assigned");
                }
            }

            details.print();
        }
    }
}
exports.command = function (opts) {
    opts.command('cus')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) get the list of provisioned customers from the system"
        })
        .option('detail', {
            abbr: 'd',
            metavar: 'NAME',
            help: "detailed information on a customer, filtered on company name"
        })
        .help("Provides customer information from the PSM Server.")
        .callback(function (opts) {
            rest.get(helper.getURL(opts) + 'Customers', helper.getOptions(opts),
                function (error, data, res) {
                    if (error instanceof Error) {
                        helper.handleError(error.message);
                    } else {
                        if (res.statusCode === 200) {
                            if (opts.detail) {
                                detailToConsole(data, opts);
                            } else {
                                listToConsole(data);
                            }
                        } else {
                            helper.not200(res, "Customer Info");
                        }
                    }
                });
        }
    );
};

exports.listToConsole = listToConsole;