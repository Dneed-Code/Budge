var express = require('express');
var router = express.Router();
const User = require('../../domain/models/User');
const user_controller = require("../controllers/userController");

// /* GET user dashboard. */
// router.get('/', function (req, res, next) {
//     res.render('user', {title: 'Users'});
// });
//
// /* Post new user. */
// router.post('/', function (req, res) {
//     const user = new User({
//         user_group: req.body.user_group,
//         first_name: req.body.first_name,
//         last_name: req.body.last_name,
//         permission_level: req.body.permission_level,
//         email_address: req.body.email_address,
//     });
//     user.save()
//         .then(data => {
//             res.status(200).json(data);
//         })
//         .catch(err => {
//             res.status(404).json({message: err});
//         })
// });




// login
router.get('/login',(req,res)=>{
    res.render('login');
})
router.post('/register',(req,res)=>{
    const {name,email, password, password2} = req.body;
    let errors = [];
    console.log(' Name ' + name+ ' email :' + email+ ' pass:' + password);
    if(!name || !email || !password || !password2) {
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
            name : name,
            email : email,
            password : password,
            password2 : password2})
    } else {
        //validation passed
        User.findOne({email : email}).exec((err,user)=> {
            console.log(user);
            if (user) {
                errors.push({msg: 'email already registered'});
                res.render('register', {errors: errors})
                //render(res, errors, name, email, password, password2);

            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
                });
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

