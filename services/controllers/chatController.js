const User = require('../../domain/models/User');
const UserGroup = require('../../domain/models/UserGroup');
// const Message = require('../../domain/models/Message');
const expense_logic = require('../../domain/app/expenseLogic');
const {body, validationResult} = require('express-validator');
const async = require('async');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


// Gets Expense page
exports.index = function (req, res, next) {
    async.parallel({
        user_group: function (callback) {
            UserGroup.findById(req.user.user_group, callback);
        },
        // messages: function (callback) {
        //     Message.find({}, callback);
        // }
    }, function (err, results) {
        res.render('chat', {title: 'Group Chat', error: err, data: results, chat: true, user: req.user});
    });
};


// Handle expense create on POST.
exports.message_create_post = [

    // Validate and santise the name field.
    body('source', 'Expense source required').trim().isLength({min: 2}).escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {
        var message = new Message(req.body);
        message.save((err) =>{
            if(err)
                sendStatus(500);
            res.sendStatus(200);
        })
    }];



