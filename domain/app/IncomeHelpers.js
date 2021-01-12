var moment = require('moment');
/**
 * Calculate the difference in months from the start date of the transaction to the end date of the transaction
 */
exports.monthDiff = function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 1 : months;
}

/**
 * Calculate the date key for dictionary
 */
exports.getDictKey = function getDictKey(date) {
    var key = date.toLocaleString('default', {month: 'short'}) + " " + date.getFullYear();
    return key;
}
/**
 * Returns the change in expenses from last month to current month in a string format consumable for front end
 */
exports.constructChangeMessage = function constructChangeMessage(monthlyIncomeData) {
    var dateNow = new Date();
    var lastMonthMo = moment(dateNow);
    lastMonthMo.subtract(1, 'months');
    var lastMonth = new Date(lastMonthMo);
    var change;
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
/**
 * Returns the start date of the transaction as this will be the date paid
 */
exports.getDatePaid = function getDatePaid(startDate) {
    var startDate = new Date(startDate);
    var datePaid = startDate.getDate();
    return datePaid;
}
function getDictKey(date) {
    var key = date.toLocaleString('default', {month: 'short'}) + " " + date.getFullYear();
    return key;
}
function getDatePaid(startDate) {
    var startDate = new Date(startDate);
    var datePaid = startDate.getDate();
    return datePaid;
}