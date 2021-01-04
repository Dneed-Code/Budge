var express = require('express');
var router = express.Router();
const User = require('../../domain/models/User');
const user_controller = require("../controllers/userController");
const bcrypt = require("bcrypt");

// login
router.get('/login',(req,res)=>{
    res.render('login');
})
router.post('/register',(req,res)=>{
    const {firstName, lastName,email, password, password2} = req.body;
    let errors = [];
    console.log(' Name ' + firstName+ ' email :' + email+ ' pass:' + password);
    if(!firstName ||!lastName || !email || !password || !password2) {
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
            email : email,
            password : password,
            password2 : password2})
    } else {
        //validation passed
        User.findOne({email : email}).exec((err,user)=> {
            console.log(user);
            if (user) {
                errors.push({msg: 'email already registered'});
                res.render('register', {errors: errors, lastName: lastName ,firstName: firstName, email: email, password: password})
                //render(res, errors, name, email, password, password2);

            } else {
                const newUser = new User({
                    first_name: firstName,
                    last_name: lastName,
                    email_address: email,
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
router.post('/register',(req,res)=>{
})
router.post('/login',(req,res,next)=>{
})
// logout
router.get('/logout',(req,res)=>{
})

// // POST request to delete income.
// router.post('/register', user_controller.user_register);

module.exports = router;

