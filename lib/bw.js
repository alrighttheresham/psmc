/*
 * System Info
 * https://github.com/alrighttheresham/psmc
 *
 * Copyright (c) 2013 Damian ONeill
 * Licensed under the MIT license.
 */

'use strict';

var helper = require('./helper');
var columnizer = require('columnizer');


function blindOrAware(colorAware) {
    if (colorAware != null) {
        if (colorAware === true) {
            return "aware";
        } else {
            return "blind";
        }
    }
    return "";

}

function deviceBwProfilesToConsole(data) {
    if (data.shelfList) {
        for (var i = 0; i < data.shelfList.length; i++) {
            console.log("");
            console.log("--- Profiles Stored on the Network Element: " + data.shelfList[i].networkElement.address + " ---");
            console.log("");
            var deviceBwProfiles = new columnizer();
            deviceBwProfiles.row("Name", "Mode", "Col.Mode", "CIR", "CBS", "EIR", "EBS", "Int.Pri", "Ex.Action", "Ex.DSCP", "Ex.Set DEI", "Viol.Action", "Viol.DSCP", "Conf.Action", "Conf.DSCP");

            if (data.shelfList[i].ethernetLayer != null) {
                for (var j = 0; j < data.shelfList[i].ethernetLayer.bandwidthProfile.length; j++) {
                    deviceBwProfiles.row(helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].name),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].mode),
                        helper.notNull(blindOrAware(data.shelfList[i].ethernetLayer.bandwidthProfile[j].colorAware)),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].cir),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].cbs),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].eir),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].ebs),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].internalPriority),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].exceedAction),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].exceedDscp),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].exceedSetDei),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].violateAction),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].violateDscp),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].conformAction),
                        helper.notNull(data.shelfList[i].ethernetLayer.bandwidthProfile[j].conformDscp));
                }
            }
            deviceBwProfiles.print();
            console.log(" ");
        }
    }
}
var deviceBwProfilesCallback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        deviceBwProfilesToConsole(data);
    }
};

function listToConsole(opts, data) {
    console.log("");
    console.log("--- Profiles Stored on PSM Server ---");
    console.log("");
    var templateProfiles = new columnizer();
    templateProfiles.row("Name", "Mode", "Col.Mode", "CIR", "CBS", "EIR", "EBS", "Int.Pri", "Ex.Action", "Ex.DSCP", "Ex.Set DEI", "Viol.Action", "Viol.DSCP", "Conf.Action", "Conf.DSCP");
    if (data.bandwidthProfile) {
        for (var i = 0; i < data.bandwidthProfile.length; i++) {
            templateProfiles.row(data.bandwidthProfile[i].name,
                data.bandwidthProfile[i].mode,
                blindOrAware(data.bandwidthProfile[i].colorAware),
                data.bandwidthProfile[i].cir,
                data.bandwidthProfile[i].cbs,
                data.bandwidthProfile[i].eir,
                data.bandwidthProfile[i].ebs,
                helper.notNull(data.bandwidthProfile[i].internalPriority),
                helper.notNull(data.bandwidthProfile[i].exceedAction),
                helper.notNull(data.bandwidthProfile[i].exceedDscp),
                helper.notNull(data.bandwidthProfile[i].exceedSetDei),
                helper.notNull(data.bandwidthProfile[i].violateAction),
                helper.notNull(data.bandwidthProfile[i].violateDscp),
                helper.notNull(data.bandwidthProfile[i].conformAction),
                helper.notNull(data.bandwidthProfile[i].conformDscp));
        }
    }
    templateProfiles.print();
    console.log(" ");
    helper.requestWithEncoding(opts, "Devices/ShelfInfo", deviceBwProfilesCallback);
}

var callback = function (err, opts, data) {
    if (err) {
        console.log(err);
    } else {
        listToConsole(opts, data);
    }
};

exports.command = function (opts) {
    opts.command('bw')
        .option('list', {
            abbr: 'l',
            flag: true,
            help: "(default) get the BW Profile Information"
        })
        .help("Provides information on the provisioned BW Profiles")
        .callback(function (opts) {
            helper.requestWithEncoding(opts, "Profiles/BandwidthProfiles", callback);
        });
};


exports.listToConsole = listToConsole;