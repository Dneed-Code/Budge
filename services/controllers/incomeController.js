const User = require('../../domain/models/User');
const UserGroup = require('../../domain/models/UserGroup');
const Income = require('../../domain/models/Transaction');
const transaction_logic = require('../../domain/app/incomeLogic');
const {body, validationResult} = require('express-validator');
const async = require('async');
const mongoose = require('mongoose');
const expense_logic = require("../../domain/app/expenseLogic");
const ObjectId = mongoose.Types.ObjectId;


// Gets Income page
exports.index = function (req, res, next) {
    async.parallel({
        income_count: function (callback) {
            console.log(req.user.user_group)
            transaction_logic.countIncomes(callback, req.user.user_group);
        },
        income_list: function (callback) {
            transaction_logic.listIncomes(callback, req.user.user_group);
        },
        income_per_month: function (callback) {
            transaction_logic.getIncomePerMonth(req.user.user_group).then(function (incomePerMonth) {
                callback("", incomePerMonth);
            })
                .catch((err) => {
                    console.log(err);
                })
        },
        income_current_month: function (callback) {
            transaction_logic.getIncomeCurrentMonth(req.user.user_group).then(function (incomeCurrentMonth) {
                callback("", incomeCurrentMonth);
            })
                .catch((err) => {
                    console.log(err);
                })
        },
        change: function (callback) {
            transaction_logic.getChange(req.user.user_group).then(function (change) {
                callback("", change);
            })
                .catch((err) => {
                    console.log(err);
                })
        },
        active_incomes: function (callback) {
            transaction_logic.listActiveIncomes(callback, req.user.user_group);
        },
        user_group: function (callback) {
            UserGroup.findById(req.user.user_group, callback);
        }
    }, function (err, results) {
        res.render('income', {title: 'Income', error: err, data: results, income: true, user: req.user});
    });
};

// Display list of all Incomes.
exports.income_list = function (req, res, next) {
    Income.find({}, 'user source amount date_paid')
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
    body('source', 'Income source required').trim().isLength({min: 2}).escape(),
    body('amount', 'Income source required').trim().isLength({min: 1}).escape(),
    body('start_date', 'Income start date required').trim().isLength({min: 2}).escape(),
    body('end_date', 'Income end date required').trim().isLength({min: 2}).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        var datePaid = transaction_logic.getDatePaid(req.body.start_date);
        var status = transaction_logic.getStatus(req.body.start_date, req.body.end_date);

        // Create a income object with escaped and trimmed data.
        var income = new Income(
            {
                transaction_type: "Income",
                user: req.user,
                source: req.body.source,
                date_paid: datePaid,
                amount: req.body.amount,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                status: status
            }
        );
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('income', {title: 'Income', income: income, errors: errors.array(), income: true});
        } else {
            // Data from form is valid.
            // Check if Income with same name already exists.
            Income.findOne({'source': req.body.source, 'date_paid': datePaid, 'amount': req.body.amount})
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
                            // Income saved. Redirect to income page.
                            async.parallel({
                                    income_per_month: function (callback) {
                                        transaction_logic.getIncomePerMonth(req.user.user_group).then(function (incomePerMonth) {
                                            callback("", incomePerMonth);
                                        })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    },
                                }, function (err, results) {
                                req.app.io.emit('group update', results); //emit to everyone
                            })

                            res.redirect('/income');
                        });
                    }
                });
        }
    }];

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
            Income.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        // Success
        // Income has no dependants. Delete object and redirect to the list of incomes.
        Income.findByIdAndRemove(req.params.id, function deleteIncome(err) {
            if (err) {
                return next(err);
            }
            // Success - go to income list
            async.parallel({
                income_per_month: function (callback) {
                    transaction_logic.getIncomePerMonth(req.user.user_group).then(function (incomePerMonth) {
                        callback("", incomePerMonth);
                    })
                        .catch((err) => {
                            console.log(err);
                        })
                },
            }, function (err, results) {
                req.app.io.emit('group update', results); //emit to everyone
            })
            res.redirect('/income')
        })
    });
};

// Display income update form on GET.
exports.income_update_get = function (req, res, next) {

    // Get income and user for form.
    async.parallel({
        income_found: function (callback) {
            console.log(req.params.id);
            Income.find({_id: req.params.id}, callback).populate('user');
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.income_found == null) { // No results.
            var err = new Error('Income not found', err);
            err.status = 404;
            return next(err);
        }
        // Success.
        res.send({data: results});
    });

};

// Handle income update on POST.
exports.income_update_post = [


    // Validate and santise the name field.
    body('source', 'Income source required').trim().isLength({min: 2}).escape(),
    body('amount', 'Income source required').trim().isLength({min: 1}).escape(),
    body('start_date', 'Income start date required').trim().isLength({min: 2}).escape(),
    body('end_date', 'Income end date required').trim().isLength({min: 2}).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        var datePaid = transaction_logic.getDatePaid(req.body.start_date);
        var status = transaction_logic.getStatus(req.body.start_date, req.body.end_date);

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Income object with escaped/trimmed data and old id.
        var income = new Income(
            {
                transaction_type: "Income",
                source: req.body.source,
                date_paid: req.body.date_paid,
                amount: req.body.amount,
                _id: req.params.id,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                status: status
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

                async.parallel({
                    income_per_month: function (callback) {
                        transaction_logic.getIncomePerMonth(req.user.user_group).then(function (incomePerMonth) {
                            callback("", incomePerMonth);
                        })
                            .catch((err) => {
                                console.log(err);
                            })
                    },
                }, function (err, results) {
                    req.app.io.emit('group update', results); //emit to everyone
                })
                // Successful - redirect to income detail page.
                res.redirect('/income');
            });
        }
    }
];



