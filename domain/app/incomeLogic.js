/**
 * Income logic:
 * Logic for handling the expense transaction within the expense controller
 */

/**
 * Dependencies
 * Income = our Income model
 * User = our user model
 * Moment = a library for formatting dates
 * Mongoose = ORM
 */

const Income = require('../../domain/models/Transaction');
const User = require('../../domain/models/User')
const IncomeHelpers = require('./IncomeHelpers')
var moment = require('moment');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * Counts the number of incomes in this user group
 */
exports.countIncomes = function (callback, userGroup) {
    const users = User.find({user_group: userGroup});
    var userIds = [];
    users.then(function (doc) {
        for (var i = 0; i < doc.length; i++) {
            userIds.push(doc[i]._id.toString());
        }
        return Income.countDocuments({transaction_type: 'Income', user: {$in: userIds}}, callback); // Pass an income string as match condition to find all documents of this collection
    }).catch((err) => {
        console.log(err);
    });
}

/**
 * Returns a list of all expenses in this user group (can be interpreted as JSON)
 */
exports.listIncomes = function (callback, userGroup) {
    const users = User.find({user_group: userGroup});
    var userIds = [];
    users.then(function (doc) {
        for (var i = 0; i < doc.length; i++) {
            userIds.push(doc[i]._id.toString());
        }
        Income.find({
            'transaction_type': 'Income',
            user: {$in: userIds}
        }, '_id user source amount date_paid start_date end_date status', callback).populate('user');
    }).catch((err) => {
        console.log(err);
    });
}
/**
 * Returns a list of all active expenses in this user group (can be interpreted as JSON)
 */
exports.listActiveIncomes = function (callback, userGroup) {
    const users = User.find({user_group: userGroup});
    var userIds = [];
    users.then(function (doc) {
        for (var i = 0; i < doc.length; i++) {
            userIds.push(doc[i]._id.toString());
        }
        Income.find({
            'transaction_type': 'Income',
            user: {$in: userIds},
            status: true
        }, 'user source amount date_paid start_date end_date status', callback).populate('user');
    }).catch((err) => {
        console.log(err);
    });
}
/**
 * Returns a list of all expenses in this user group for each month of the current year
 */
exports.getIncomePerMonth = function (userGroup) {
    return new Promise(function (resolve, reject) {
        const users = User.find({user_group: userGroup});
        var userIds = [];
        users.then(function (doc) {
            for (var i = 0; i < doc.length; i++) {
                userIds.push(doc[i]._id.toString());
            }
            const incomes = Income.find({
                transaction_type: "Income",
                user: {$in: userIds}
            }, 'user amount date_paid start_date end_date');
            let monthlyIncomeData = [];
            incomes.then(function (doc) {
                monthlyIncomeData = getMonthlyIncomeData(monthlyIncomeData, doc);
                var thisYearIncome = [];
                var dateNow = new Date();
                var startDate = new Date(dateNow.getFullYear(), 0);
                var startDateMo = moment(startDate);
                for (var j = 0; j < 12; j++) {

                    if (isNaN(monthlyIncomeData[IncomeHelpers.getDictKey(startDate)])) {
                        thisYearIncome[j] = 0;
                    } else {
                        thisYearIncome[j] = monthlyIncomeData[IncomeHelpers.getDictKey(startDate)];
                    }
                    startDateMo.add(1, 'months');
                    startDate = new Date(startDateMo);
                }
                resolve(thisYearIncome);
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            //console.log(err);

        });
    });
}

/**
 * Returns the incomes for the current month
 */
exports.getIncomeCurrentMonth = function getIncomeCurrentMonth(userGroup) {
    return new Promise(function (resolve, reject) {
        var userIds = [];
        const users = User.find({user_group: userGroup});
        users.then(function (doc) {
            //console.log(doc);
            for (var i = 0; i < doc.length; i++) {
                userIds.push(doc[i]._id.toString());
            }
            const incomes = Income.find({
                transaction_type: "Income",
                user: {$in: userIds}
            }, 'user amount date_paid start_date end_date');
            let monthlyIncomeData = [];
            incomes.then(function (doc) {
                monthlyIncomeData = getMonthlyIncomeData(monthlyIncomeData, doc);
                var dateNow = new Date();
                var data = monthlyIncomeData[IncomeHelpers.getDictKey(dateNow)]
                resolve(data);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });

            //console.log(doc);
        }).catch((err) => {
            reject(err);
        });
    });
}


/**
 * Returns the change in expenses from last month to current month
 */
exports.getChange = function getChange(userGroup) {
    return new Promise(function (resolve, reject) {
        const users = User.find({user_group: userGroup});
        var userIds = [];
        users.then(function (doc) {
            for (var i = 0; i < doc.length; i++) {
                userIds.push(doc[i]._id.toString());
            }
            const incomes = Income.find({
                transaction_type: "Income",
                user: {$in: userIds}
            }, 'user amount date_paid start_date end_date');
            let monthlyIncomeData = [];
            incomes.then(function (doc) {
                monthlyIncomeData = getMonthlyIncomeData(monthlyIncomeData, doc);
                var change = IncomeHelpers.constructChangeMessage(monthlyIncomeData);
                resolve(change);
            }).catch((err) => {
                console.log(err);
            });
        });
    });
}


/**
 * Returns the status of the transaction i.e. whether its active or not
 */
exports.getStatus = function getStatus(startDateInput, endDateInput) {
    var status;
    var currentDate = new Date();
    var startDate = new Date(startDateInput);
    var endDate = new Date(endDateInput);

    if (endDate > currentDate) {
        if (startDate < currentDate) {
            status = true;
        } else {
            status = false;
        }
    } else {
        status = false;
    }
    return status;
}


/**
 * Returns the transaction data from each contributing expense and assigns them their month in a dictionary
 */

exports.getMonthlyIncomeData = function getMonthlyIncomeData(incomeData, doc) {

    // For each Income
    for (var i = 0; i < doc.length; i++) {
        var startDate = doc[i].start_date;
        var endDate = doc[i].end_date;
        var numberOfMonths = IncomeHelpers.monthDiff(startDate, endDate);
        var startDateMo = moment(startDate);

        for (var j = 0; j < numberOfMonths; j++) {

            if (isNaN(incomeData[IncomeHelpers.getDictKey(startDate)])) {
                incomeData[IncomeHelpers.getDictKey(startDate)] = doc[i].amount;
            } else {
                var newAmount = incomeData[IncomeHelpers.getDictKey(startDate)] + doc[i].amount;
                incomeData[IncomeHelpers.getDictKey(startDate)] = newAmount;
            }

            startDateMo.add(1, 'months');
            startDate = new Date(startDateMo);
        }
    }

    return incomeData;
}

function getMonthlyIncomeData(incomeData, doc) {

    // For each Income
    for (var i = 0; i < doc.length; i++) {
        var startDate = doc[i].start_date;
        var endDate = doc[i].end_date;
        var numberOfMonths = IncomeHelpers.monthDiff(startDate, endDate);
        var startDateMo = moment(startDate);

        for (var j = 0; j < numberOfMonths; j++) {

            if (isNaN(incomeData[IncomeHelpers.getDictKey(startDate)])) {
                incomeData[IncomeHelpers.getDictKey(startDate)] = doc[i].amount;
            } else {
                var newAmount = incomeData[IncomeHelpers.getDictKey(startDate)] + doc[i].amount;
                incomeData[IncomeHelpers.getDictKey(startDate)] = newAmount;
            }

            startDateMo.add(1, 'months');
            startDate = new Date(startDateMo);
        }
    }

    return incomeData;
}

exports.getDatePaid = function getDatePaid(startDate) {
    var startDate = new Date(startDate);
    var datePaid = startDate.getDate();
    return datePaid;
}