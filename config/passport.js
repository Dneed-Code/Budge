const User = require("../domain/models/User");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


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