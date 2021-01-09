const User = require('../../domain/models/User');
const UserGroup = require('../../domain/models/UserGroup');
const Notification = require('../../domain/models/Notification');
const Income = require('../../domain/models/Transaction');
const income_logic = require('../../domain/app/incomeLogic')
const expense_logic = require('../../domain/app/expenseLogic');
const {body, validationResult} = require('express-validator');
const async = require('async');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);



// Gets Dashboard page
exports.index = function (req, res, next) {
    async.parallel({
        income_per_month: function (callback) {
            income_logic.getIncomePerMonth(req.user.user_group).then(function (incomePerMonth) {
                callback("", incomePerMonth);
            })
                .catch((err) => {
                    console.log(err);
                })
        },
        expense_per_month: function (callback) {
            expense_logic.getExpensePerMonth(req.user.user_group).then(function (expensePerMonth) {
                callback("", expensePerMonth);
            })
                .catch((err) => {
                    console.log(err);
                })
        },notifications: function (callback) {
            Notification.find({user_group: req.user.user_group}, callback).populate('user');
        },
        user_group: function (callback) {
            UserGroup.findById(req.user.user_group, callback);
        }
    }, function (err, results) {
        res.render('index', {title: 'Dashboard', error: err, data: results, dashboard: true, user: req.user});
        req.app.io.emit('group update', results); //emit to everyone
    });
};