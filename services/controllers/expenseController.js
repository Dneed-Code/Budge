var User = require('../../domain/models/User');
var Expense = require('../../domain/models/Transaction');

var async = require('async');

// Gets Expense page
exports.index = function(req, res, next) {
    async.parallel({
        expense_count: function(callback) {
            Expense.countDocuments({transaction_type:'Expense'}, callback); // Pass an expense string as match condition to find all documents of this collection
        },
        expense_list: function(callback) {
            Expense.find({}, 'user source amount', callback).populate('user');
        },
    }, function(err, results) {
        res.render('expense', { title: 'Expense', error: err, data: results });
    });
};
// Display list of all Expenses.
exports.expense_list = function(req, res, next) {
    Expense.find({}, 'user source amount')
        .populate('user')
        .exec(function (err, list_expenses) {
            if (err) { return next(err); }
            //Successful, so render
            res.send({expense_list: list_expenses });
        });
};

// Display detail page for a specific Expense.
exports.expense_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: expense detail: ' + req.params.id);
};

// Display expense create form on GET.
exports.expense_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: expense create GET');
};

// Handle expense create on POST.
exports.expense_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: expense create POST');
};

// Display expense delete form on GET.
exports.expense_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: expense delete GET');
};

// Handle expense delete on POST.
exports.expense_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: expense delete POST');
};

// Display Author update form on GET.
exports.expense_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: expense update GET');
};

// Handle Author update on POST.
exports.expense_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: expense update POST');
};
