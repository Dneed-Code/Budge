var User = require('../../domain/models/User');
var Income = require('../../domain/models/Transaction');

const { body,validationResult } = require('express-validator');
var async = require('async');

// Gets Income page
exports.index = function(req, res, next) {
    async.parallel({
        income_count: function(callback) {
            Income.countDocuments({transaction_type:'Income'}, callback); // Pass an income string as match condition to find all documents of this collection
        },
        income_list: function(callback) {
            Income.find({}, 'user source amount interval', callback).populate('user');
        },
    }, function(err, results) {
        res.render('income', { title: 'Income', error: err, data: results });
    });
};
// Display list of all Incomes.
exports.income_list = function(req, res, next) {
    Income.find({}, 'user source amount interval')
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
exports.income_create_get = function(req, res, next) {
   //Might need this for populating modal for edit?
};

// Handle income create on POST.
exports.income_create_post =  [

    // Validate and santise the name field.
    body('name', 'Income name required').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a income object with escaped and trimmed data.
        var income = new Income(
            { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('income_form', { title: 'Create Income', income: income, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Income with same name already exists.
            Income.findOne({ 'name': req.body.name })
                .exec( function(err, found_income) {
                    if (err) { return next(err); }

                    if (found_income) {
                        // Income exists, redirect to its detail page.
                        res.redirect(found_income.url);
                    }
                    else {

                        income.save(function (err) {
                            if (err) { return next(err); }
                            // Income saved. Redirect to income detail page.
                            res.redirect(income.url);
                        });

                    }

                });
        }
    }
];

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
