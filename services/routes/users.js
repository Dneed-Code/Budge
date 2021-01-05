var express = require('express');
var router = express.Router();
const User = require('../../domain/models/User');
const user_controller = require("../controllers/userController");
const bcrypt = require("bcrypt");
const passport = require('passport');
// login
router.get('/login',(req,res)=>{
    res.render('login', {layout: 'pre-main', title: 'Login'});
})
router.post('/register',(req,res)=>{
    const {firstName, lastName,email, password, password2} = req.body;
    let errors = [];
    var lowerCaseEmail = email.toLowerCase();
    console.log(' Name ' + firstName+ ' email :' + lowerCaseEmail+ ' pass:' + password);
    if(!firstName ||!lastName || !lowerCaseEmail || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }
//check if match
    if(password !== password2) {
        errors.push({msg : "passwords dont match"});
    }

//check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'password atleast 6 characters'})
    }
    if(errors.length > 0 ) {
        res.render('register', {
            errors : errors,
            firstName : firstName,
            lastName: lastName,
            email : lowerCaseEmail,
            password : password,
            password2 : password2,
            layout: 'pre-main'})
    } else {
        //validation passed
        User.findOne({email_address : lowerCaseEmail}).exec((err,user)=> {
            console.log("found a user?" + user);
            if (user) {
                errors.push({msg: 'email already registered'});
                res.render('register', {title: 'Register',layout: 'pre-main',errors: errors, lastName: lastName ,firstName: firstName, email: lowerCaseEmail, password: password})
                //render(res, errors, name, email, password, password2);

            } else {
                const newUser = new User({
                    first_name: firstName,
                    last_name: lastName,
                    email_address: lowerCaseEmail,
                    password: password,
                    user_group: '5fc8eeb4f90fb40cd8645cd3'
                });

                //hash password
                bcrypt.genSalt(10,(err,salt)=>
                    bcrypt.hash(newUser.password,salt,
                        (err,hash)=> {
                            if(err) throw err;
                            //save pass to hash
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then((value)=>{
                                    console.log(value)
                                    req.flash('success_msg','You have now registered!');
                                    res.redirect('/users/login');
                                })
                                .catch(value=> console.log(value));

                        }));
            }
        });
    }
});
// Register

router.post('/login',emailToLowerCase,(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true,
    })(req,res,next);
})
function emailToLowerCase(req, res, next){
    req.body.email = req.body.email.toLowerCase();
    next();
}
// logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/users/login');
})

// // POST request to delete income.
// router.post('/register', user_controller.user_register);

module.exports = router;

