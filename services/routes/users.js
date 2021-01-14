var express = require('express');
var router = express.Router();
const User = require('../../domain/models/User');
const UserGroup = require('../../domain/models/UserGroup');
const user_controller = require("../controllers/userController");
const bcrypt = require("bcrypt");
const passport = require('passport');
// login
router.get('/login', (req, res) => {
    res.render('login', {layout: 'pre-main', title: 'Login'});
})


router.post('/register', user_controller.register);


router.post('/login', emailToLowerCase, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
})

function emailToLowerCase(req, res, next) {
    req.body.email = req.body.email.toLowerCase();
    next();
}

// logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Now logged out');
    res.redirect('/users/login');
})

// // POST request to delete income.
// router.post('/register', user_controller.user_register);

module.exports = router;

