const Expense = require('../../domain/models/Transaction');
const User = require('../../domain/models/User')
var moment = require('moment');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Count the number of expenses
// TODO: Make this only count the current users group
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

// List the all the expenses
// TODO: Make this only list the expenses from the current users group
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
// List the all the active expenses
// TODO: Make this only list the expenses from the current users group
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

// Calculate the Expense per month of all the cumulative expenses in the list
// TODO: Make this only calculate the expenses from the current users group
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

// Calculate the expense of the current month
// TODO: Make this user/usergroup specific
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

// Calculate the change in expense between last month and this month
// TODO: Make this user/usergroup specific
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

// Get Start dates day of the Month as this will be date paid
exports.getDatePaid = function getDatePaid(startDate) {
    var startDate = new Date(startDate);
    var datePaid = startDate.getDate();
    return datePaid;
}

// Get status (If its an expense still being received or not)
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

// Create a string message that conveys the change in expense from last month to the current month
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

// Calculate the Monthly Expense Data
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

    //
    //
    //
    // for (var i = 0; i < doc.length; i++) {

    //     for (var j = startDate.getMonth(); j < numberOfMonths + startDate.getMonth(); j++) {
    //         expenseData[j] += doc[i].amount;
    //     }
    // }
    return expenseData;
}

// Calculate the difference in months from the start date of the transaction to the end date of the transaction
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 1 : months;
}

// Get date key for dictionary
function getDictKey(date) {
    var key = date.toLocaleString('default', {month: 'short'}) + " " + date.getFullYear();
    return key;
}
