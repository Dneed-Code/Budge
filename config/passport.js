/**
 * Dependencies
 * User = our user model
 * Local strategy = our exported values from the constructor defining our passport strategy
 * bcrypt = hashing and salting for passwords
 */
const User = require("../domain/models/User");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

/**
 * Function for logging users in
 * Emails are forced to lower case to ensure they aren't case sensitive
 * It'll check our current users, reporting back on whether the email is not registered or password is incorrect
 * Serialising and de-serialising when necessary
 */
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField : 'email'},(email,password,done)=> {
            email.toLowerCase();
            //match user
            User.findOne({email_address : email})
                .then((user)=>{
                    if(!user) {
                        return done(null,false,{message : 'That email is not registered, try again!'});
                    }
                    //match pass
                    bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if(err) throw err;

                        if(isMatch) {
                            return done(null,user);
                        } else {
                            return done(null,false,{message : 'Password incorrect, try again!'});
                        }
                    })
                })
                .catch((err)=> {console.log(err)})
        })
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    })
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        })
    })
}