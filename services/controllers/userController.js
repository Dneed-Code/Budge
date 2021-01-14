const User = require('../../domain/models/User');
const UserGroup = require('../../domain/models/UserGroup');
const {body, validationResult} = require('express-validator');
const async = require('async');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcrypt");
const passport = require('passport');


// Gets user page
exports.register = function (req, res) {
    const {firstName, lastName, email, password, password2, userGroupName, userGroupPassword} = req.body;
    let errors = [];

    var lowerCaseEmail = email.toLowerCase();
    console.log(' Name ' + firstName + ' email :' + lowerCaseEmail + ' pass:' + password + 'ugpw' + userGroupPassword);
    if (!firstName || !lastName || !lowerCaseEmail || !password || !password2 || !userGroupName || !userGroupPassword) {
        errors.push({msg: "Please fill in all fields"})
    }
//check if match
    if (password !== password2) {
        errors.push({msg: "Passwords didn't match!"});
    }

//check if password is more than 6 characters
    if (password.length < 6) {
        errors.push({msg: 'password atleast 6 characters'})
    }

// Check if its an existing user group
    var userGroupId;
    // var lowerCaseUserGroupName = userGroupName.toLowerCase();
    UserGroup.findOne({name: userGroupName}).exec((err, userGroup) => {
        if (userGroup) {
            console.log(userGroup);
            if (userGroup.password === userGroupPassword) {
                userGroupId = userGroup;
            } else if (userGroup.password !== userGroupPassword) {
                errors.push({msg: 'User group exists, this is the wrong password!'});
                res.render('register', {
                    title: 'Register',
                    layout: 'pre-main',
                    errors: errors,
                    lastName: lastName,
                    firstName: firstName,
                    email: lowerCaseEmail,
                    password: password,
                    userGroup: userGroupName,
                    userGroupPassword: userGroupPassword
                })
            }
        }
        if (!userGroup) {
            const newUserGroup = new UserGroup({
                name: userGroupName,
                password: userGroupPassword
            });
            newUserGroup.save();
            userGroupId = newUserGroup;

        }
    });
    if (errors.length > 0) {
        res.render('register', {
            errors: errors,
            firstName: firstName,
            lastName: lastName,
            email: lowerCaseEmail,
            password: password,
            password2: password2,
            userGroup: userGroupName,
            userGroupPassword: userGroupPassword,
            layout: 'pre-main'
        })
    } else {
        //validation passed
        User.findOne({email_address: lowerCaseEmail}).exec((err, user) => {
            console.log("found a user?" + user);
            if (user) {
                errors.push({msg: 'email already registered'});
                res.render('register', {
                    title: 'Register',
                    layout: 'pre-main',
                    errors: errors,
                    lastName: lastName,
                    firstName: firstName,
                    email: lowerCaseEmail,
                    password: password,
                    userGroup: userGroupName,
                    userGroupPassword: userGroupPassword
                })
                //render(res, errors, name, email, password, password2);

            } else {
                const newUser = new User({
                    first_name: toTitleCase(firstName),
                    last_name: toTitleCase(lastName),
                    email_address: lowerCaseEmail,
                    password: password,
                    user_group: userGroupId,
                    colour: getRandomColor()
                });

                //hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt,
                        (err, hash) => {
                            if (err) throw err;
                            //save pass to hash
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then((value) => {
                                    console.log(value)
                                    req.flash('success_msg', 'You have now registered!');
                                    res.redirect('/users/login');
                                })
                                .catch(value => console.log(value));
                        }));
            }
        });
    }
};


function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
