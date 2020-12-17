var User = require('../../domain/models/User');
var Income = require('../../domain/models/Transaction');

var async = require('async');

// Gets Income page
exports.index = function(req, res, next) {
    async.parallel({
        income_count: function(callback) {
            Income.countDocuments({transaction_type:'Income'}, callback); // Pass an income string as match condition to find all documents of this collection
        },
        income_list: function(callback) {
            Income.find({}, 'user source amount', callback).populate('user');
        },
    }, function(err, results) {
        res.render('income', { title: 'Income', error: err, data: results });
    });
};
// Display list of all Incomes.
exports.income_list = function(req, res, next) {
    Income.find({}, 'user source amount')
        .populate('user')
        .exec(function (err, list_incomes) {
            if (err) { return next(err); }
            //Successful, so render
            res.send({income_list: list_incomes });
        });
};

// Display detail page for a specific Income.
exports.income_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: income detail: ' + req.params.id);
};

// Display income create form on GET.
exports.income_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: income create GET');
};

// Handle income create on POST.
exports.income_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: income create POST');
};

// Display income delete form on GET.
exports.income_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: income delete GET');
};

// Handle income delete on POST.
exports.income_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: income delete POST');
};

// Display Author update form on GET.
exports.income_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: income update GET');
};

// Handle Author update on POST.
exports.income_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: income update POST');
};
