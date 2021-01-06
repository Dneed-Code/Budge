const User = require('../../domain/models/User');
const UserGroup = require('../../domain/models/UserGroup');
const Income = require('../../domain/models/Transaction');
const transaction_logic = require('../../domain/app/transactionLogic');
const {body, validationResult} = require('express-validator');
const async = require('async');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Gets Dashboard page
exports.index = function (req, res, next) {
    async.parallel({
        user_group: function (callback) {
            UserGroup.findById(req.user.user_group, callback);
        }
    }, function (err, results) {
        res.render('index', {title: 'Dashboard', error: err, data: results, dashboard: true, user: req.user});
    });
};