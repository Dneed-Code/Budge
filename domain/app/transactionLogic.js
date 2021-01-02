const Income = require('../../domain/models/Transaction');
var moment = require('moment');

// Count the number of incomes
// TODO: Make this only count the current users group
exports.countIncomes = function (callback) {
    return Income.countDocuments({transaction_type: 'Income'}, callback); // Pass an income string as match condition to find all documents of this collection
}

// List the all the incomes
// TODO: Make this only list the incomes from the current users group
exports.listIncomes = function (callback) {
    Income.find({'transaction_type': 'Income'}, 'user source amount date_paid start_date end_date status', callback).populate('user');
}
// List the all the active incomes
// TODO: Make this only list the incomes from the current users group
exports.listActiveIncomes = function (callback) {
    Income.find({
        'transaction_type': 'Income',
        status: true
    }, 'user source amount date_paid start_date end_date status', callback).populate('user');
}

// Calculate the Income per month of all the cumulative incomes in the list
// TODO: Make this only calculate the incomes from the current users group
exports.getIncomePerMonth = function () {
    return new Promise(function (resolve, reject) {
        const incomes = Income.find({transaction_type: "Income"}, 'user amount date_paid start_date end_date');
        let monthlyIncomeData = [];
        incomes.then(function (doc) {
            monthlyIncomeData = getMonthlyIncomeData(monthlyIncomeData, doc);
            var thisYearIncome = [];
            var dateNow = new Date();
            var startDate = new Date(dateNow.getFullYear(), 0);
            var startDateMo = moment(startDate);
            for (var j = 0; j < 12; j++) {

                if (isNaN(monthlyIncomeData[getDictKey(startDate)])) {
                    thisYearIncome[j] = 0;
                } else {
                    thisYearIncome[j] = monthlyIncomeData[getDictKey(startDate)];
                }

                startDateMo.add(1, 'months');
                startDate = new Date(startDateMo);
            }


            resolve(thisYearIncome);
        }).catch((err) => {
            console.log(err);
        });
    });
}

// Calculate the income of the current month
// TODO: Make this user/usergroup specific
exports.getIncomeCurrentMonth = function getIncomeCurrentMonth() {
    return new Promise(function (resolve, reject) {
        const incomes = Income.find({transaction_type: "Income"}, 'user amount date_paid start_date end_date');
        let monthlyIncomeData = [];
        incomes.then(function (doc) {
            monthlyIncomeData = getMonthlyIncomeData(monthlyIncomeData, doc);
            var dateNow = new Date();
            var currentMonth = dateNow;
            resolve(monthlyIncomeData[getDictKey(currentMonth)]);
        }).catch((err) => {
            console.log(err);
        });
    });
}

// Calculate the change in income between last month and this month
// TODO: Make this user/usergroup specific
exports.getChange = function getChange() {
    return new Promise(function (resolve, reject) {
        const incomes = Income.find({transaction_type: "Income"}, 'user amount date_paid start_date end_date');
        let monthlyIncomeData = [];
        incomes.then(function (doc) {
            monthlyIncomeData = getMonthlyIncomeData(monthlyIncomeData, doc);
            var change = constructChangeMessage(monthlyIncomeData);
            resolve(change);
        }).catch((err) => {
            console.log(err);
        });
    });
}

// Get Start dates day of the Month as this will be date paid
exports.getDatePaid = function getDatePaid(startDate) {
    var startDate = new Date(startDate);
    var datePaid = startDate.getDate();
    return datePaid;
}

// Get status (If its an income still being received or not)
exports.getStatus = function getStatus(startDate, endDate) {
    var status = Boolean(false);
    var currentDate = new Date();
    var tempEndDate = new Date(endDate);
    if (tempEndDate > currentDate && startDate < currentDate) {
        status = true;
    } else {
        status = false;
    }
    return status;
}

// Create a string message that conveys the change in income from last month to the current month
function constructChangeMessage(monthlyIncomeData) {
    var dateNow = new Date();
    var lastMonthMo = moment(dateNow);
    lastMonthMo.subtract(1, 'months');
    var lastMonth = new Date(lastMonthMo);
    var change;
    console.log(lastMonth);
    var changeAmount = monthlyIncomeData[getDictKey(dateNow)] - monthlyIncomeData[getDictKey(lastMonth)];
    var changePercentage = ((changeAmount / monthlyIncomeData[getDictKey(lastMonth)]) * 100).toFixed(2) + '%';
    if (monthlyIncomeData[getDictKey(dateNow)] < monthlyIncomeData[getDictKey(lastMonth)]) {
        change = "a decrease of " + " " + "£" + Math.abs(changeAmount) + " " + " a " + " " + changePercentage + " " + "change in income from last month.";
    } else if (monthlyIncomeData[getDictKey(dateNow)] > monthlyIncomeData[getDictKey(lastMonth)]) {
        change = "a increase of " + " " + "£" + Math.abs(changeAmount) + " " + " a " + " " + changePercentage + " " + "change in income from last month.";
    } else {
        change = "the same income as last month, great work your income is stable!";
    }
    return change;
}

// Calculate the Monthly Income Data
function getMonthlyIncomeData(incomeData, doc) {

    // For each Income
    for (var i = 0; i < doc.length; i++) {
        var startDate = doc[i].start_date;
        var endDate = doc[i].end_date;
        var numberOfMonths = monthDiff(startDate, endDate);
        var startDateMo = moment(startDate);

        for (var j = 0; j < numberOfMonths; j++) {

            if (isNaN(incomeData[getDictKey(startDate)])) {
                console.log("this is err");
                incomeData[getDictKey(startDate)] = doc[i].amount;
            } else {
                var newAmount = incomeData[getDictKey(startDate)] + doc[i].amount;
                console.log(incomeData[getDictKey(startDate)]);
                console.log(doc[i].amount);
                console.log('pls sir');
                incomeData[getDictKey(startDate)] = newAmount;
            }

            startDateMo.add(1, 'months');
            startDate = new Date(startDateMo);
        }
    }
    console.log(incomeData);
    //
    //
    //
    // for (var i = 0; i < doc.length; i++) {

    //     for (var j = startDate.getMonth(); j < numberOfMonths + startDate.getMonth(); j++) {
    //         incomeData[j] += doc[i].amount;
    //     }
    // }
    return incomeData;
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
