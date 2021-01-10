/**
 * Configurations for Handlebars helpers my view engine of choice
 * These helpers extend the front end capability of handlebars
 */

/**
 * Dependencies
 * hbs = Handlebars view engine for front end
 * exphbs = Instantiate express handlebars
 * moment = A library for formatting DateTimes
 */
var hbs = require('express-handlebars');
var exphbs = hbs.create({});
var moment = require('moment'); // require

/**
 * Date formats used throughout the app
 */
var DateFormats = {
    year: "YYYYMMDD",
    short: "DD MMMM - YYYY",
    long: "dddd DD.MM.YYYY HH:mm"
};

/**
 * Helper for formatting standard dates with either of our three date formats
 */
exphbs.handlebars.registerHelper('formatDate', function(datetime, format) {
    if (moment) {
        // can use other formats like 'lll' too
        format = DateFormats[format] || format;
        return moment(datetime).format(format);
    }
    else {
        return datetime;
    }
});
/**
 * Helper for formatting date paid dates for transactions (Datatable use)
 */
exphbs.handlebars.registerHelper('formatDatePaid', function(number) {
        var j = number % 10,
            k = number % 100;
        if (j == 1 && k != 11) {
            return number + "st";
        }
        if (j == 2 && k != 12) {
            return number + "nd";
        }
        if (j == 3 && k != 13) {
            return number + "rd";
        }
        return number + "th";
    }
);
/**
 * Helper for formatting end date dates for transactions (Datatable use)
 * If a transaction (income or expense) is three years in
 * the future or longer it is considered 'ongoing'
 */
exphbs.handlebars.registerHelper('formatEndDate', function(datetime, format, type) {
    var endDateNoEnd = new Date(2024, 11, 12);
    if (datetime > endDateNoEnd){
        return 'Ongoing ' + type;
    }
    if (moment) {
        // can use other formats like 'lll' too
        format = DateFormats[format] || format;
        return moment(datetime).format(format);
    }
    else {
        return datetime;
    }
});