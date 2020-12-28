var User = require('../../domain/models/User');
var Income = require('../../domain/models/Transaction');

const {body, validationResult} = require('express-validator');
var async = require('async');

// Gets Income page
exports.index = function (req, res, next) {
    async.parallel({
        income_count: function (callback) {
            Income.countDocuments({transaction_type: 'Income'}, callback); // Pass an income string as match condition to find all documents of this collection
        },
        income_list: function (callback) {
            Income.find({}, 'user source amount interval start_date end_date', callback).populate('user');
        },
        income_per_month: function (callback) {
            getIncomePerMonth().then(function (incomePerMonth) {
                callback("", incomePerMonth);
            })
                .catch((err) => {
                    console.log(err);
                })
        },
        income_current_month: function (callback) {
            getIncomeCurrentMonth().then(function (incomeCurrentMonth) {
                callback("", incomeCurrentMonth);
            })
                .catch((err) => {
                    console.log(err);
                })
        },
        change: function (callback) {
            getChange().then(function (change) {
                callback("", change);
            })
                .catch((err) => {
                    console.log(err);
                })
        },
    }, function (err, results) {
        res.render('income', {title: 'Income', error: err, data: results});
    });
};


// Display list of all Incomes.
exports.income_list = function (req, res, next) {
    Income.find({}, 'user source amount interval')
        .populate('user')
        .exec(function (err, list_incomes) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.send({income_list: list_incomes});
        });
};

// Display detail page for a specific Income.
exports.income_detail = function (req, res) {
    res.send('NOT IMPLEMENTED: income detail: ' + req.params.id);
};

// Display income create form on GET.
exports.income_create_get = function (req, res, next) {
    //Might need this for populating modal for edit?
};

// Handle income create on POST.
exports.income_create_post = [

    // Validate and santise the name field.
    body('name', 'Income name required').trim().isLength({min: 1}).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a income object with escaped and trimmed data.
        var income = new Income(
            {
                transaction_type: "Income",
                user: "5fc8ef42ba58094c449725c4",
                source: req.body.source,
                interval: req.body.interval,
                amount: req.body.amount
            }
        );


        // if (!errors.isEmpty()) {
        //     // There are errors. Render the form again with sanitized values/error messages.
        //     res.render('income', { title: 'Income', income: income, errors: errors.array()});
        //     return;
        // }
        // else {
        // Data from form is valid.
        // Check if Income with same name already exists.
        Income.findOne({'name': req.body.name})
            .exec(function (err, found_income) {
                if (err) {
                    return next(err);
                }

                if (found_income) {
                    // Income exists, redirect to its detail page.
                    res.redirect(found_income.url);
                } else {

                    income.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        // Income saved. Redirect to income detail page.
                        res.redirect(income.url);
                    });

                }

            });
    }

];

// Display income delete form on GET.
exports.income_delete_get = function (req, res, next) {
    async.parallel({
        income: function (callback) {
            Income.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.income == null) { // No results.
            res.redirect('/incomes');
        }
        // Successful, so render.
        res.render('income_delete', {title: 'Delete Income', income: results.income});
    });
};

// Handle income delete on POST.
exports.income_delete_post = function (req, res) {
    async.parallel({
        income: function (callback) {
            Income.findById(req.body.incomeid).exec(callback)
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        // Success
        // Income has no dependants. Delete object and redirect to the list of incomes.
        Income.findByIdAndRemove(req.body.incomeid, function deleteIncome(err) {
            if (err) {
                return next(err);
            }
            // Success - go to income list
            res.redirect('/incomes')
        })
    });
};

// Display income update form on GET.
exports.income_update_get = function (req, res, next) {

    // Get income and user for form.
    async.parallel({
        income: function (callback) {
            Income.findById(req.params.id).populate('user').exec(callback);
        },
        users: function (callback) {
            User.find(callback);
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.income == null) { // No results.
            var err = new Error('Income not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('income_modal', {title: 'Update Income', authors: results.users, income: results.income});
    });

};

// Handle income update on POST.
exports.income_update_post = [

    // Validate and sanitise fields.
    body('source', 'Source must not be empty.').trim().isLength({min: 1}).escape(),
    body('interval', 'Interval must not be empty.').trim().isLength({min: 1}).escape(),
    body('amount', 'Amount must not be empty.').trim().isLength({min: 1}).escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Income object with escaped/trimmed data and old id.
        var income = new Income(
            {
                transaction_type: "Income",
                source: req.body.source,
                interval: req.body.interval,
                amount: req.body.amount,
                _id: req.params.id
            });

        income.user = Income.findById(req.params.id).populate('user');
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all users for form.
            async.parallel({
                users: function (callback) {
                    User.find(callback);
                },
            }, function (err, results) {
                if (err) {
                    return next(err);
                }

                res.render('income', {
                    title: 'Update Income',
                    users: results.users,
                    income: income,
                    errors: errors.array()
                });
            });

        } else {
            // Data from form is valid. Update the record.
            Income.findByIdAndUpdate(req.params.id, income, {}, function (err, theincome) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to income detail page.
                res.redirect('/income');
            });
        }
    }
];

function getIncomePerMonth() {
    return new Promise(function (resolve, reject) {
        const incomes = Income.find({transaction_type: "Income"}, 'user amount interval start_date end_date');
        let monthlyIncomeData = new Array(12).fill(0);
        incomes.then(function (doc) {
            for (var i = 0; i < doc.length; i++) {
                var startMonth = doc[i].start_date.getMonth();
                var numberOfMonths = doc[i].end_date.getMonth() - startMonth;
                for (var j = startMonth; j < numberOfMonths + startMonth; j++) {
                    monthlyIncomeData[j] += doc[i].amount;
                }
                console.log(numberOfMonths);
            }
            resolve(monthlyIncomeData);
        }).catch((err) => {
            console.log(err);
        });
    });
}
function getIncomeCurrentMonth() {
    return new Promise(function (resolve, reject) {
        const incomes = Income.find({transaction_type: "Income"}, 'user amount interval start_date end_date');
        let monthlyIncomeData = new Array(12).fill(0);
        incomes.then(function (doc) {
            for (var i = 0; i < doc.length; i++) {
                var startMonth = doc[i].start_date.getMonth();
                var numberOfMonths = doc[i].end_date.getMonth() - startMonth;
                for (var j = startMonth; j < numberOfMonths + startMonth; j++) {
                    monthlyIncomeData[j] += doc[i].amount;
                }
                console.log(numberOfMonths);
            }
            var dateNow = new Date();
            var currentMonth = dateNow.getMonth();
            resolve(monthlyIncomeData[currentMonth]);
        }).catch((err) => {
            console.log(err);
        });
    });
}

function getChange() {
    return new Promise(function (resolve, reject) {
        const incomes = Income.find({transaction_type: "Income"}, 'user amount interval start_date end_date');
        let monthlyIncomeData = new Array(12).fill(0);
        incomes.then(function (doc) {
            for (var i = 0; i < doc.length; i++) {
                var startMonth = doc[i].start_date.getMonth();
                var numberOfMonths = doc[i].end_date.getMonth() - startMonth;
                for (var j = startMonth; j < numberOfMonths + startMonth; j++) {
                    monthlyIncomeData[j] += doc[i].amount;
                }
                console.log(numberOfMonths);
                var dateNow = new Date();
                var currentMonth = dateNow.getMonth();
                var lastMonth = currentMonth - 1;
                var change = "";
                var changeAmount = monthlyIncomeData[currentMonth] - monthlyIncomeData[lastMonth];
                var changePercentage = ((changeAmount / monthlyIncomeData[lastMonth]) * 100).toFixed(2) + '%';
                if (monthlyIncomeData[currentMonth] < monthlyIncomeData[lastMonth]) {
                    change = "a decrease of " +" " +"£"+ Math.abs(changeAmount) + " "+ " a " +" "+ changePercentage + " " + "change in income from last month.";
                } else if (monthlyIncomeData[currentMonth] > monthlyIncomeData[lastMonth]) {
                    change = "an increase of"
                } else {
                    change = "the same"
                }
            }
            resolve(change);
        }).catch((err) => {
            console.log(err);
        });
    });
}
