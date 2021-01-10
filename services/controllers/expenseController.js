const User = require('../../domain/models/User');
const UserGroup = require('../../domain/models/UserGroup');
const Expense = require('../../domain/models/Transaction');
const Notification = require('../../domain/models/Notification');
const expense_logic = require('../../domain/app/expenseLogic');
const {body, validationResult} = require('express-validator');
const async = require('async');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


// Gets Expense page
exports.index = function (req, res, next) {
    async.parallel({
        expense_count: function (callback) {
            console.log(req.user.user_group)
            expense_logic.countExpenses(callback, req.user.user_group);
        },
        expense_list: function (callback) {
            expense_logic.listExpenses(callback, req.user.user_group);
        },
        expense_per_month: function (callback) {
            expense_logic.getExpensePerMonth(req.user.user_group).then(function (expensePerMonth) {
                callback("", expensePerMonth);
            })
                .catch((err) => {
                    console.log(err);
                })
        },
        expense_current_month: function (callback) {
            expense_logic.getExpenseCurrentMonth(req.user.user_group).then(function (expenseCurrentMonth) {
                callback("", expenseCurrentMonth);
            })
                .catch((err) => {
                    console.log(err);
                })
        },
        change: function (callback) {
            expense_logic.getChange(req.user.user_group).then(function (change) {
                callback("", change);
            })
                .catch((err) => {
                    console.log(err);
                })
        },
        active_expenses: function (callback) {
            expense_logic.listActiveExpenses(callback, req.user.user_group);
        },
        user_group: function (callback) {
            UserGroup.findById(req.user.user_group, callback);
        }
    }, function (err, results) {
        res.render('expense', {title: 'Expenses', error: err, data: results, expense: true, user: req.user});
    });
};

// Display list of all Expenses.
exports.expense_list = function (req, res, next) {
    Expense.find({}, 'user source amount date_paid')
        .populate('user')
        .exec(function (err, list_expenses) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.send({expense_list: list_expenses});
        });
};

// Display detail page for a specific Expense.
exports.expense_detail = function (req, res) {
    res.send('NOT IMPLEMENTED: expense detail: ' + req.params.id);
};

// Display expense create form on GET.
exports.expense_create_get = function (req, res, next) {
    //Might need this for populating modal for edit?
};

// Handle expense create on POST.
exports.expense_create_post = [

    // Validate and santise the name field.
    body('source', 'Expense source required').trim().isLength({min: 2}).escape(),
    body('amount', 'Expense source required').trim().isLength({min: 1}).escape(),
    body('start_date', 'Expense start date required').trim().isLength({min: 2}).escape(),
    body('end_date', 'Expense end date required').trim().isLength({min: 2}).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        var datePaid = expense_logic.getDatePaid(req.body.start_date);
        var status = expense_logic.getStatus(req.body.start_date, req.body.end_date);

        // Create a expense object with escaped and trimmed data.
        var expense = new Expense(
            {
                transaction_type: "Expense",
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
            res.render('expense', {title: 'Expenses', expense: expense, errors: errors.array(), expense: true});
        } else {
            // Data from form is valid.
            // Check if Expense with same name already exists.
            Expense.findOne({'source': req.body.source, 'date_paid': datePaid, 'amount': req.body.amount})
                .exec(function (err, found_expense) {
                    if (err) {
                        return next(err);
                    }
                    if (found_expense) {
                        // Expense exists, redirect to its detail page.
                        res.redirect(found_expense.url);
                    } else {
                        expense.save(function (err) {
                            if (err) {
                                return next(err);
                            }
                            async.parallel({
                                expense_per_month: function (callback) {
                                    expense_logic.getExpensePerMonth(req.user.user_group).then(function (expensePerMonth) {
                                        callback("", expensePerMonth);
                                    })
                                        .catch((err) => {
                                            console.log(err);
                                        })
                                },
                            }, function (err, results) {
                                req.app.io.emit('group update', results); //emit to everyone
                            })
                            // Expense saved. Redirect to expense page.

                        });
                    }
                });
        }
        var dateNow = new Date();
        var notification = new Notification(
            {
                title: "New Expense added",
                user: req.user,
                user_group: req.user.user_group,
                date_time: dateNow,
                description: req.user.first_name + " " + req.user.last_name + " has added an expense, the source is " + expense.source
            }
        );

        notification.save(function (err) {
            if (err) {
                return next(err);
            } else {
                req.app.io.emit('notification', notification); //emit to everyone
                res.redirect('/expense');
            }

        });
    }];

// Display expense delete form on GET.
exports.expense_delete_get = function (req, res, next) {
    async.parallel({
        expense: function (callback) {
            Expense.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.expense == null) { // No results.
            res.redirect('/expenses');
        }
        // Successful, so render.
        res.render('expense_delete', {title: 'Delete Expense', expense: results.expense});
    });
};

// Handle expense delete on POST.
exports.expense_delete_post = function (req, res) {
    async.parallel({
        expense: function (callback) {
            Expense.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        // Success
        // Expense has no dependants. Delete object and redirect to the list of expenses.
        var dateNow = new Date();
        var notification = new Notification(
            {
                title: "Expense Deleted",
                user: req.user,
                user_group: req.user.user_group,
                date_time: dateNow,
                description: req.user.first_name + " " + req.user.last_name + " has deleted an expense, the source was " + results.expense.source
            }
        );

        notification.save(function (err) {
            if (err) {
                return next(err);
            } else {
                req.app.io.emit('notification', notification); //emit to everyone
                res.redirect('/expense');
            }

        });
        Expense.findByIdAndRemove(req.params.id, function deleteExpense(err) {
            if (err) {
                return next(err);
            }
            // Success - go to expense list
            async.parallel({
                expense_per_month: function (callback) {
                    expense_logic.getExpensePerMonth(req.user.user_group).then(function (expensePerMonth) {
                        callback("", expensePerMonth);
                    })
                        .catch((err) => {
                            console.log(err);
                        })
                },
            }, function (err, results) {
                req.app.io.emit('group update', results); //emit to everyone
            })

        })
    });

};

// Display expense update form on GET.
exports.expense_update_get = function (req, res, next) {

    // Get expense and user for form.
    async.parallel({
        expense_found: function (callback) {
            console.log(req.params.id);
            Expense.find({_id: req.params.id}, callback).populate('user');
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.expense_found == null) { // No results.
            var err = new Error('Expense not found', err);
            err.status = 404;
            return next(err);
        }
        // Success.
        res.send({data: results});
    });

};

// Handle expense update on POST.
exports.expense_update_post = [


    // Validate and santise the name field.
    body('source', 'Expense source required').trim().isLength({min: 2}).escape(),
    body('amount', 'Expense source required').trim().isLength({min: 1}).escape(),
    body('start_date', 'Expense start date required').trim().isLength({min: 2}).escape(),
    body('end_date', 'Expense end date required').trim().isLength({min: 2}).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        var datePaid = expense_logic.getDatePaid(req.body.start_date);
        var status = expense_logic.getStatus(req.body.start_date, req.body.end_date);

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Expense object with escaped/trimmed data and old id.
        var expense = new Expense(
            {
                transaction_type: "Expense",
                source: req.body.source,
                date_paid: req.body.date_paid,
                amount: req.body.amount,
                _id: req.params.id,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                status: status
            });

        expense.user = Expense.findById(req.params.id).populate('user');
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

                res.render('expense', {
                    title: 'Update Expense',
                    users: results.users,
                    expense: expense,
                    errors: errors.array()
                });
            });

        } else {
            // Data from form is valid. Update the record.
            Expense.findByIdAndUpdate(req.params.id, expense, {}, function (err, theexpense) {
                if (err) {
                    return next(err);
                }
                async.parallel({
                    expense_per_month: function (callback) {
                        expense_logic.getExpensePerMonth(req.user.user_group).then(function (expensePerMonth) {
                            callback("", expensePerMonth);
                        })
                            .catch((err) => {
                                console.log(err);
                            })
                    },
                }, function (err, results) {
                    req.app.io.emit('group update', results); //emit to everyone
                })
                // Successful - redirect to expense detail page.

            });
            var dateNow = new Date();
            var notification = new Notification(
                {
                    title: "Expense updated",
                    user: req.user,
                    user_group: req.user.user_group,
                    date_time: dateNow,
                    description: req.user.first_name + " " + req.user.last_name + " has updated an expense, the source is " + expense.source
                }
            );

            notification.save(function (err) {
                if (err) {
                    return next(err);
                } else {
                    req.app.io.emit('notification', notification); //emit to everyone
                    res.redirect('/expense');
                }

            });
        }
    }
];



