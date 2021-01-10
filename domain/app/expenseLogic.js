/**
 * Expense logic:
 * Logic for handling the expense transaction within the expense controller
 */

/**
 * Dependencies
 * Expense = our expense model
 * User = our user model
 * Moment = a library for formatting dates
 * Mongoose = ORM
 */
const Expense = require('../../domain/models/Transaction');
const User = require('../../domain/models/User')
var moment = require('moment');
const mongoose = require('mongoose');

/**
 * Counts the number of expenses in this user group
 */
exports.countExpenses = function (callback, userGroup) {
    const users = User.find({user_group: userGroup});
    var userIds = [];
    users.then(function (doc) {
        for (var i = 0; i < doc.length; i++) {
            userIds.push(doc[i]._id.toString());
        }
        return Expense.countDocuments({transaction_type: 'Expense', user: {$in: userIds}}, callback); // Pass an expense string as match condition to find all documents of this collection
    }).catch((err) => {
        console.log(err);
    });
}

/**
 * Returns a list of all expenses in this user group (can be interpreted as JSON)
 */
exports.listExpenses = function (callback, userGroup) {
    const users = User.find({user_group: userGroup});
    var userIds = [];
    users.then(function (doc) {
        for (var i = 0; i < doc.length; i++) {
            userIds.push(doc[i]._id.toString());
        }
        Expense.find({
            'transaction_type': 'Expense',
            user: {$in: userIds}
        }, '_id user source amount date_paid start_date end_date status', callback).populate('user');
    }).catch((err) => {
        console.log(err);
    });
}
/**
 * Returns a list of all active expenses in this user group (can be interpreted as JSON)
 */
exports.listActiveExpenses = function (callback, userGroup) {
    const users = User.find({user_group: userGroup});
    var userIds = [];
    users.then(function (doc) {
        for (var i = 0; i < doc.length; i++) {
            userIds.push(doc[i]._id.toString());
        }
        Expense.find({
            'transaction_type': 'Expense',
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
exports.getExpensePerMonth = function (userGroup) {
    return new Promise(function (resolve, reject) {
        const users = User.find({user_group: userGroup});
        var userIds = [];
        users.then(function (doc) {
            for (var i = 0; i < doc.length; i++) {
                userIds.push(doc[i]._id.toString());
            }
            const expenses = Expense.find({
                transaction_type: "Expense",
                user: {$in: userIds}
            }, 'user amount date_paid start_date end_date');
            let monthlyExpenseData = [];
            expenses.then(function (doc) {
                monthlyExpenseData = getMonthlyExpenseData(monthlyExpenseData, doc);
                var thisYearExpense = [];
                var dateNow = new Date();
                var startDate = new Date(dateNow.getFullYear(), 0);
                var startDateMo = moment(startDate);
                for (var j = 0; j < 12; j++) {
                    if (isNaN(monthlyExpenseData[getDictKey(startDate)])) {
                        thisYearExpense[j] = 0;
                    } else {
                        thisYearExpense[j] = monthlyExpenseData[getDictKey(startDate)];
                    }
                    startDateMo.add(1, 'months');
                    startDate = new Date(startDateMo);
                }
                resolve(thisYearExpense);
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    });
}

/**
 * Returns the expenses for the current month
 */
exports.getExpenseCurrentMonth = function getExpenseCurrentMonth(userGroup) {
    return new Promise(function (resolve, reject) {
        var userIds = [];
        const users = User.find({user_group: userGroup});
        users.then(function (doc) {
            for (var i = 0; i < doc.length; i++) {
                userIds.push(doc[i]._id.toString());
            }
            const expenses = Expense.find({
                transaction_type: "Expense",
                user: {$in: userIds}
            }, 'user amount date_paid start_date end_date');
            let monthlyExpenseData = [];
            expenses.then(function (doc) {
                monthlyExpenseData = getMonthlyExpenseData(monthlyExpenseData, doc);
                var dateNow = new Date();
                var currentMonth = dateNow;
                console.log(doc);
                resolve(monthlyExpenseData[getDictKey(currentMonth)]);
            }).catch((err) => {
                console.log(err);
            });
            console.log(userIds);
        }).catch((err) => {
            console.log(err);
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
        const expenses = Expense.find({transaction_type: "Expense", user: {$in: userIds} }, 'user amount date_paid start_date end_date');
        let monthlyExpenseData = [];
        expenses.then(function (doc) {
            monthlyExpenseData = getMonthlyExpenseData(monthlyExpenseData, doc);
            var change = constructChangeMessage(monthlyExpenseData);
            resolve(change);
        }).catch((err) => {
            console.log(err);
        });});
    });
}

/**
 * Returns the start date of the transaction as this will be the date paid
 */
exports.getDatePaid = function getDatePaid(startDate) {
    var startDate = new Date(startDate);
    var datePaid = startDate.getDate();
    return datePaid;
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
 * Returns the change in expenses from last month to current month in a string format consumable for front end
 */
function constructChangeMessage(monthlyExpenseData) {
    var dateNow = new Date();
    var lastMonthMo = moment(dateNow);
    lastMonthMo.subtract(1, 'months');
    var lastMonth = new Date(lastMonthMo);
    var change;
    var changeAmount = monthlyExpenseData[getDictKey(dateNow)] - monthlyExpenseData[getDictKey(lastMonth)];
    var changePercentage = ((changeAmount / monthlyExpenseData[getDictKey(lastMonth)]) * 100).toFixed(2) + '%';
    if (monthlyExpenseData[getDictKey(dateNow)] < monthlyExpenseData[getDictKey(lastMonth)]) {
        change = "a decrease of " + " " + "£" + Math.abs(changeAmount) + " " + " a " + " " + changePercentage + " " + "change in expense from last month.";
    } else if (monthlyExpenseData[getDictKey(dateNow)] > monthlyExpenseData[getDictKey(lastMonth)]) {
        change = "a increase of " + " " + "£" + Math.abs(changeAmount) + " " + " a " + " " + changePercentage + " " + "change in expense from last month.";
    } else {
        change = "the same expense as last month, great work your expense is stable!";
    }
    return change;
}

/**
 * Returns the transaction data from each contributing expense and assigns them their month in a dictionary
 */
function getMonthlyExpenseData(expenseData, doc) {

    // For each Expense
    for (var i = 0; i < doc.length; i++) {
        var startDate = doc[i].start_date;
        var endDate = doc[i].end_date;
        var numberOfMonths = monthDiff(startDate, endDate);
        var startDateMo = moment(startDate);

        for (var j = 0; j < numberOfMonths; j++) {

            if (isNaN(expenseData[getDictKey(startDate)])) {
                expenseData[getDictKey(startDate)] = doc[i].amount;
            } else {
                var newAmount = expenseData[getDictKey(startDate)] + doc[i].amount;
                expenseData[getDictKey(startDate)] = newAmount;
            }
            startDateMo.add(1, 'months');
            startDate = new Date(startDateMo);
        }
    }
    return expenseData;
}

/**
 * Calculate the difference in months from the start date of the transaction to the end date of the transaction
 */
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 1 : months;
}

/**
 * Calculate the date key for dictionary
 */
function getDictKey(date) {
    var key = date.toLocaleString('default', {month: 'short'}) + " " + date.getFullYear();
    return key;
}
