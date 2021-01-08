var hbs = require('express-handlebars');
var exphbs = hbs.create({});
var moment = require('moment'); // require
var DateFormats = {
    year: "YYYYMMDD",
    short: "DD MMMM - YYYY",
    long: "dddd DD.MM.YYYY HH:mm"
};
// register new function for formatting dates in view
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
// register new function for formatting dates paid in view
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
// register new function for formatting dates in view
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